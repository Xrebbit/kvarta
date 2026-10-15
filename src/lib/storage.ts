import fs from 'fs';
import path from 'path';


//JSON используется для демонстрации логики
export type Lead = {
    id: number;
    name: string;
    phone: string;
    interest: string;
    comment: string;
    utm: {
        source: string;
        medium: string;
        campaign: string;
        content: string;
    };
    referrer: string;
    createdAt: string;
};

const FILE_PATH = path.join(process.cwd(), 'leads.json');

function readLeads(): Lead[] {
    if (!fs.existsSync(FILE_PATH)) {
        return [];
    }

    try {
        const parsed = JSON.parse(fs.readFileSync(FILE_PATH, 'utf-8'));
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function saveLead(lead: Lead): void {
    const leads = readLeads();
    leads.push(lead);
    fs.writeFileSync(FILE_PATH, JSON.stringify(leads, null, 2), 'utf-8');
}