'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { captureAttribution, getAttribution } from '@/lib/attribution';
import { paperNoise } from '@/lib/paper';
import { normalizePhone } from '@/lib/validate-phone';

type Interest = 'subscription' | 'one-time' | 'question';
type Status = 'idle' | 'sending' | 'success';
type Field = 'name' | 'phone' | 'consent';
type Errors = Partial<Record<Field, string>>;
type Notice = { tone: 'error' | 'info'; text: string } | null;

const INTERESTS: { value: Interest; label: string }[] = [
  { value: 'subscription', label: 'Подписка' },
  { value: 'one-time', label: 'Разовый заказ' },
  { value: 'question', label: 'Вопрос' },
];

const TEXT = {
  name: 'Введите имя, минимум 2 символа',
  nameLetters: 'В имени можно использовать только буквы',
  phone: 'Введите корректный белорусский номер, например +375 29 123-45-67',
  consent: 'Подтвердите согласие на обработку персональных данных',
  network:
    'Не удалось отправить заявку. Проверьте интернет и нажмите кнопку ещё раз. Если не получится, приезжайте в мастерскую: Минск, ул. Короля, 9.',
  server:
    'Не удалось отправить заявку. Попробуйте ещё раз через минуту. Данные в форме сохранены.',
};

const REQUEST_TIMEOUT_MS = 15000;
const NAME_FORBIDDEN = /[^\p{L}\s'’.-]/gu;
const NAME_VALID = /^\p{L}[\p{L}\s'’.-]*$/u;

function formatNational(digits: string): string {
  const a = digits.slice(0, 2);
  const b = digits.slice(2, 5);
  const c = digits.slice(5, 7);
  const d = digits.slice(7, 9);
  let out = '';
  if (a) out += a.length === 2 ? `(${a})` : `(${a}`;
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (d) out += `-${d}`;
  return out;
}

function extractNational(raw: string): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.length > 9) {
    if (digits.startsWith('375')) digits = digits.slice(3);
    else if (digits.startsWith('80')) digits = digits.slice(2);
  }
  return digits.slice(0, 9);
}

function BelarusFlag() {
  return (
    <svg width="26" height="15" viewBox="0 0 26 15" aria-hidden="true" className="shrink-0">
      <rect width="26" height="10" fill="#c8313e" />
      <rect y="10" width="26" height="5" fill="#2f9e55" />
      <rect width="4" height="15" fill="#f4efe6" />
      <path d="M2 1 L3.4 3 L2 5 L0.6 3 Z M2 6 L3.4 8 L2 10 L0.6 8 Z M2 11 L3.4 13 L2 15 L0.6 13 Z" fill="#c8313e" />
    </svg>
  );
}

const inputBase =
  'w-full border bg-[#f5eddd]/45 px-4 text-[15px] text-[#1f1812] placeholder:text-[#1f1812]/50 focus:border-[#a0522d] focus:outline-none focus:ring-1 focus:ring-[#a0522d]';

export default function LeadModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const sendingRef = useRef(false);

  const [name, setName] = useState('');
  const [digits, setDigits] = useState('');
  const [interest, setInterest] = useState<Interest>('subscription');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState<Notice>(null);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    captureAttribution();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const sync = () => {
      const wantsOpen = window.location.hash === '#lead';
      if (wantsOpen && !dialog.open) {
        dialog.showModal();
        document.body.style.overflow = 'hidden';
        window.setTimeout(() => nameRef.current?.focus(), 30);
      } else if (!wantsOpen && dialog.open) {
        dialog.close();
      }
    };

    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const handleClose = () => {
    document.body.style.overflow = '';
    if (window.location.hash === '#lead') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (status === 'success') {
      setStatus('idle');
      setName('');
      setDigits('');
      setComment('');
      setConsent(false);
      setInterest('subscription');
    }
    setErrors({});
    setNotice(null);
  };

  const requestClose = () => dialogRef.current?.close();

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let next = extractNational(event.target.value);
    if (next === digits && event.target.value.length < formatNational(digits).length) {
      next = next.slice(0, -1);
    }
    setDigits(next);
    if (errors.phone) setErrors((current) => ({ ...current, phone: undefined }));
  };

  const validate = (): Errors => {
    const found: Errors = {};
    const trimmedName = name.trim();
    if (trimmedName.length < 2) found.name = TEXT.name;
    else if (!NAME_VALID.test(trimmedName)) found.name = TEXT.nameLetters;
    if (normalizePhone(`+375${digits}`) === null) found.phone = TEXT.phone;
    if (!consent) found.consent = TEXT.consent;
    return found;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return;

    const found = validate();
    setErrors(found);
    setNotice(null);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0] as Field;
      dialogRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }

    sendingRef.current = true;
    setStatus('sending');

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: name.trim(),
          phone: `+375${digits}`,
          interest,
          comment: comment.trim(),
          website: String(new FormData(event.currentTarget).get('website') ?? ''),
          ...getAttribution(),
        }),
      });
      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (response.ok) {
        setStatus('success');
        return;
      }

      setStatus('idle');
      if (response.status === 429) {
        setNotice({ tone: 'info', text: data?.message ?? TEXT.server });
      } else if (response.status === 400) {
        const message = data?.message ?? TEXT.server;
        if (message.includes('номер')) setErrors({ phone: TEXT.phone });
        else if (message.includes('Имя')) setErrors({ name: message });
        else setNotice({ tone: 'error', text: message });
      } else {
        setNotice({ tone: 'error', text: TEXT.server });
      }
    } catch {
      setStatus('idle');
      setNotice({ tone: 'error', text: TEXT.network });
    } finally {
      window.clearTimeout(timeout);
      sendingRef.current = false;
    }
  };

  const sending = status === 'sending';

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      aria-labelledby="lead-title"
      className="m-0 h-full max-h-none w-full max-w-none overflow-hidden bg-transparent p-0 backdrop:bg-transparent"
    >
      <div aria-hidden="true" className="fixed inset-0 bg-[#150d08]/85 backdrop-blur-[3px]" />

      <div
        className="absolute inset-0 overflow-y-auto"
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
      >
        <div
          className="flex min-h-full items-center justify-center px-3 py-3"
          onClick={(event) => {
            if (event.target === event.currentTarget) requestClose();
          }}
        >
          <div className="relative max-h-[calc(100dvh-24px)] w-full max-w-[728px] overflow-y-auto overflow-x-hidden bg-[#e4dac6] px-5 py-[clamp(16px,3.6vh,46px)] text-[#1f1812] shadow-[0_24px_70px_rgba(0,0,0,0.55)] md:px-[58px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
              style={{ backgroundImage: paperNoise }}
            />
            <Image
              src="/emblem.jpg"
              alt=""
              width={1074}
              height={675}
              className="pointer-events-none absolute -right-10 top-[clamp(10px,2.4vh,22px)] hidden w-[clamp(180px,32vh,310px)] opacity-60 mix-blend-multiply md:block"
            />

            <button
              type="button"
              onClick={requestClose}
              aria-label="Закрыть форму"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center text-[#1f1812] transition-opacity hover:opacity-60 md:right-5 md:top-5"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                <path d="M3 3 L19 19 M19 3 L3 19" />
              </svg>
            </button>

            <div className="relative">
              <div className="flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.12em] md:text-[12px]">
                <span>Оставить заявку</span>
                <span className="h-px w-12 bg-[#1f1812]/70" />
              </div>

              <h2
                id="lead-title"
                className="mt-[clamp(8px,1.6vh,16px)] font-serif text-[clamp(2.1rem,min(7vh,11vw),4.5rem)] font-semibold leading-[0.98] tracking-[-0.02em]"
              >
                Давайте <br className="hidden md:[@media(min-height:821px)]:block" />на связь
              </h2>

              {status === 'success' ? (
                <div role="status" className="mt-8 pb-4 md:mt-10">
                  <p className="font-serif text-2xl font-semibold md:text-[2rem]">Заявка принята</p>
                  <p className="mt-3 max-w-md font-serif text-[1.1rem] leading-[1.6] md:text-[1.2rem]">
                    Спасибо! Мы перезвоним вам в ближайшее время, уточним детали и поможем выбрать кофе или оформить подписку.
                  </p>
                  <button
                    type="button"
                    onClick={requestClose}
                    className="mt-8 border border-[#1f1812]/60 px-7 py-3 text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[#1f1812] hover:text-[#f5efe0]"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <>
                  <p className="mt-[clamp(8px,1.8vh,22px)] hidden max-w-[440px] font-serif text-[clamp(0.95rem,2.2vh,1.2rem)] leading-[1.55] md:[@media(min-height:700px)]:block">
                    <span className="relative inline-block">
                      Оставьте
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 100 8"
                        preserveAspectRatio="none"
                        className="absolute -bottom-1 left-0 h-[7px] w-full"
                        fill="none"
                        stroke="#b8552b"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                      >
                        <path d="M2 5 C 25 1, 60 7, 98 3" />
                      </svg>
                    </span>{' '}
                    заявку — мы перезвоним, уточним детали и поможем выбрать кофе или оформить подписку.
                  </p>

                  <form onSubmit={handleSubmit} noValidate className="mt-[clamp(10px,2.2vh,24px)]">
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute left-[-9999px] h-0 w-0 opacity-0"
                    />
                    <div>
                      <label htmlFor="lead-name" className="mb-1.5 block text-[14px]">
                        Ваше имя <span aria-hidden="true">*</span>
                      </label>
                      <input
                        ref={nameRef}
                        id="lead-name"
                        data-field="name"
                        type="text"
                        autoComplete="name"
                        maxLength={100}
                        value={name}
                        onChange={(event) => {
                          const typed = event.target.value;
                          const cleaned = typed.replace(NAME_FORBIDDEN, '');
                          setName(cleaned);
                          setErrors((current) => ({
                            ...current,
                            name: cleaned !== typed ? TEXT.nameLetters : undefined,
                          }));
                        }}
                        placeholder="Как к вам обращаться?"
                        aria-required="true"
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? 'lead-name-error' : undefined}
                        className={`${inputBase} h-[clamp(42px,5.8vh,50px)] ${errors.name ? 'border-[#b0391f]' : 'border-[#1f1812]/25'}`}
                      />
                      {errors.name && (
                        <p id="lead-name-error" role="alert" className="mt-1.5 text-[13px] text-[#a3301a]">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div className="mt-[clamp(8px,1.7vh,18px)] grid gap-[clamp(8px,1.7vh,16px)] md:grid-cols-[1.12fr_1fr] md:gap-x-[18px]">
                      <div>
                        <label htmlFor="lead-phone" className="mb-1.5 block text-[14px]">
                          Телефон <span aria-hidden="true">*</span>
                        </label>
                        <div
                          className={`flex h-[clamp(42px,5.8vh,50px)] items-center gap-3 border bg-[#f5eddd]/45 px-4 focus-within:border-[#a0522d] focus-within:ring-1 focus-within:ring-[#a0522d] ${
                            errors.phone ? 'border-[#b0391f]' : 'border-[#1f1812]/25'
                          }`}
                        >
                          <BelarusFlag />
                          <span className="text-[15px]">+375</span>
                          <input
                            id="lead-phone"
                            data-field="phone"
                            type="tel"
                            inputMode="tel"
                            autoComplete="tel-national"
                            value={formatNational(digits)}
                            onChange={handlePhoneChange}
                            placeholder="(__) ___-__-__"
                            aria-required="true"
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? 'lead-phone-error' : undefined}
                            className="min-w-0 flex-1 bg-transparent text-[15px] placeholder:text-[#1f1812]/50 focus:outline-none"
                          />
                        </div>
                        {errors.phone && (
                          <p id="lead-phone-error" role="alert" className="mt-1.5 text-[13px] leading-snug text-[#a3301a]">
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lead-interest" className="mb-1.5 block text-[14px]">
                          Что вас интересует? <span aria-hidden="true">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="lead-interest"
                            value={interest}
                            onChange={(event) => setInterest(event.target.value as Interest)}
                            className={`${inputBase} h-[clamp(42px,5.8vh,50px)] appearance-none border-[#1f1812]/25 pr-10`}
                          >
                            {INTERESTS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <svg
                            aria-hidden="true"
                            width="14"
                            height="8"
                            viewBox="0 0 14 8"
                            fill="none"
                            stroke="#1f1812"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
                          >
                            <path d="M1 1 L7 7 L13 1" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="mt-[clamp(8px,1.7vh,18px)]">
                      <label htmlFor="lead-comment" className="mb-1.5 block text-[14px]">
                        Комментарий
                      </label>
                      <textarea
                        id="lead-comment"
                        rows={2}
                        maxLength={1000}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder="Напишите, если есть вопросы или пожелания"
                        className={`${inputBase} block resize-none border-[#1f1812]/25 py-2`}
                      />
                    </div>

                    <div className="mt-[clamp(8px,1.7vh,18px)]">
                      <label className="flex cursor-pointer items-start gap-3 text-[14px]">
                        <input
                          data-field="consent"
                          type="checkbox"
                          checked={consent}
                          onChange={(event) => {
                            setConsent(event.target.checked);
                            if (errors.consent) setErrors((current) => ({ ...current, consent: undefined }));
                          }}
                          aria-invalid={Boolean(errors.consent)}
                          aria-describedby={errors.consent ? 'lead-consent-error' : undefined}
                          className="mt-0.5 h-[18px] w-[18px] shrink-0 cursor-pointer accent-[#a0522d]"
                        />
                        <span>Я согласен(а) на обработку персональных данных</span>
                      </label>
                      {errors.consent && (
                        <p id="lead-consent-error" role="alert" className="mt-1.5 text-[13px] text-[#a3301a]">
                          {errors.consent}
                        </p>
                      )}
                    </div>

                    {notice && (
                      <p
                        role="alert"
                        className={`mt-5 border-l-2 px-3 py-2 text-[14px] leading-snug ${
                          notice.tone === 'error'
                            ? 'border-[#a3301a] bg-[#a3301a]/10 text-[#7d2412]'
                            : 'border-[#8a6a2a] bg-[#8a6a2a]/10 text-[#4d3a13]'
                        }`}
                      >
                        {notice.text}
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={sending}
                      aria-busy={sending}
                      style={{ height: 'var(--bh)', width: 'calc(var(--bh) * 5.4)', marginLeft: 'calc(var(--bh) * -0.63)' }}
                      className="relative mt-[clamp(4px,1vh,12px)] flex max-w-none items-center justify-center gap-3 text-white transition-opacity [--bh:clamp(58px,9.5vh,76px)] hover:opacity-90 disabled:cursor-wait disabled:opacity-70"
                    >
                      <Image src="/brush.png" alt="" fill sizes="320px" className="object-fill" />
                      <span className="relative z-10 text-[13px] font-medium uppercase tracking-[0.08em] md:text-[14px]">
                        {sending ? 'Отправляем…' : 'Отправить заявку'}
                      </span>
                      {!sending && (
                        <span aria-hidden="true" className="relative z-10 text-xl">
                          →
                        </span>
                      )}
                    </button>
                  </form>
                </>
              )}

              <ul className="mt-[clamp(10px,2.4vh,26px)] hidden border-t border-[#1f1812]/15 pt-[clamp(8px,1.8vh,20px)] text-[13px] leading-snug md:[@media(min-height:700px)]:grid md:grid-cols-3">
                <li className="flex items-start gap-3 md:pr-4">
                  <svg width="20" height="22" viewBox="0 0 20 22" fill="none" stroke="#1f1812" strokeWidth="1.3" aria-hidden="true" className="mt-0.5 shrink-0">
                    <path d="M10 21 C 5 14, 2 11, 2 8 A 8 8 0 0 1 18 8 C 18 11, 15 14, 10 21 Z" />
                    <circle cx="10" cy="8" r="2.6" />
                  </svg>
                  <span>Минск, ул. Короля, 9 (самовывоз)</span>
                </li>
                <li className="flex items-start gap-3 md:border-l md:border-[#1f1812]/15 md:px-5">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#1f1812" strokeWidth="1.3" strokeLinecap="round" aria-hidden="true" className="mt-0.5 shrink-0">
                    <circle cx="10" cy="10" r="8.4" />
                    <path d="M10 5 V10 L13.5 12" />
                  </svg>
                  <span>
                    Пн–Пт 8:00–20:00
                    <br />
                    Сб–Вс 10:00–18:00
                  </span>
                </li>
                <li className="flex items-start gap-3 md:border-l md:border-[#1f1812]/15 md:pl-5">
                  <svg width="26" height="20" viewBox="0 0 26 20" fill="none" stroke="#1f1812" strokeWidth="1.3" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
                    <path d="M1.5 3 H15 V14 H1.5 Z M15 7 H20 L24.5 11 V14 H15" />
                    <circle cx="6" cy="15.5" r="2" fill="#e4dac6" />
                    <circle cx="19.5" cy="15.5" r="2" fill="#e4dac6" />
                  </svg>
                  <span>Доставка по Минску в пятницу, от 50 BYN — бесплатно.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <p
        aria-hidden="true"
        className="pointer-events-none fixed bottom-[9vh] right-[4vw] hidden -rotate-[12deg] font-hand text-[1.9vw] leading-tight text-[#f5efe0]/85 xl:block"
      >
        Хороший
        <br />
        кофе —
        <br />
        это про людей
      </p>
    </dialog>
  );
}
