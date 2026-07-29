import { Modal } from 'rsuite';
import { useEffect, useState } from 'react';
import { useAddressStore } from '../../../../utils/stores/useAddressStore';
import { getStates } from '../../../../utils/services/countries';
import { occupationsList } from '../../../../utils/services/occupations';
import Button from '../../../common/Button';

type Props = {
    open: boolean;
    onClose: () => void;
    clients: any[];
    saleStatus: string;
    saleType: string;
    saleFolio?: string;
};

const esc = (v: any) => String(v ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const fmtDate = (d: any) => {
    if (!d) return '—';
    const s = String(d).split('T')[0];
    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (m) return `${m[3]}/${m[2]}/${m[1]}`;
    const ym = s.match(/^(\d{4})-(\d{2})$/);
    return ym ? `${ym[2]}/${ym[1]}` : s;
};
const yesNo = (v: any) => (v==='1'||v===true||v===1 ? 'Sí' : v==='0'||v===false||v===0 ? 'No' : esc(v)||'—');

type Stamp = { text: string; color: string } | null;

const getStamp = (s: string): Stamp => {
    const t = (s || '').toLowerCase();
    if (t.includes('entregado')) return { text: 'ENTREGADO', color: '#15803d' };
    if (t.includes('pagado'))    return { text: 'PAGADO',    color: '#1d4ed8' };
    if (t.includes('informado') || t.includes('avisado')) return { text: 'AVISADO', color: '#c2410c' };
    return null;
};

// ── Mock data for empty-field simulation ───────────────────────────────────

const MOCK_CLIENT = {
    personalInformation: {
        names: 'Juan Carlos',
        lastname1: 'González',
        lastname2: 'Martínez',
        birthdate: '1990-05-15',
        sex: 'M',
        curp: 'GOMJ900515HDFNRN09',
        civilStatus: 'Casado',
        languages: [
            { language: 'Español',  percentage: 100 },
            { language: 'Inglés',   percentage: 65  },
        ],
        birthplace: {
            country:     42,
            state:       9,
            city:        'CIUDAD DE MÉXICO',
            nationality: 'MEXICANA',
        },
        passport: {
            number:            'G12345678',
            expedition_date:   '2020-03-10',
            expiration_date:   '2030-03-09',
            country_expedition: 42,
            state_expedition:   9,
            expedition_city:   'CIUDAD DE MÉXICO',
        },
        spouse: {
            names:     'Ana Sofía Ramírez Torres',
            birthdate: '1992-02-14',
            country:   42,
            state:     9,
            hasVisa:   '1',
        },
    },
    contactInformation: {
        address: {
            street:   'Av. Insurgentes Sur',
            noInt:    '301',
            noExt:    '1234',
            postCode: '06600',
            colony:   'Hipódromo Condesa',
            city:     'Ciudad de México',
            country:  42,
            state:    9,
        },
        phones: [
            { type: 'Celular', number: '55 1234-5678' },
            { type: 'Casa',    number: '55 8765-4321' },
        ],
    },
    familiarInformation: {
        relationships: [
            { relationship: 'Padre',    full_name: 'Roberto González López',        birthdate: '1960-08-20', has_visa: '0', lives_in_usa: '0' },
            { relationship: 'Madre',    full_name: 'María Martínez de González',    birthdate: '1963-11-05', has_visa: '1', lives_in_usa: '0' },
            { relationship: 'Hermano',  full_name: 'Luis González Martínez',        birthdate: '1993-09-01', has_visa: '1', lives_in_usa: '1' },
        ],
    },
    jobsSchools: {
        occupations: [
            {
                occupations_id: '1',
                name: 'Empresa Tecnológica S.A. de C.V.',
                salary: '35000',
                antiquity: '5 años',
                activities_description: 'Desarrollo y mantenimiento de sistemas internos',
                is_primary: true,
                address: { street: 'Av. Reforma', noExt: '222', colony: 'Juárez', city: 'CDMX' },
            },
        ],
        schools: [
            { name: 'Universidad Nacional Autónoma de México', degree_level: 'Licenciatura', is_last_degree: true, period: '2008-2013', address: { street: 'Ciudad Universitaria', colony: '', city: 'CDMX' } },
        ],
    },
    generalInformation: {
        residence: {
            fullName:      'Michael Johnson',
            relationship:  'Amigo',
            citizen_status:'Ciudadano',
            personalPhone: '+1 213 555 0101',
            workPhone:     '+1 213 555 0202',
            celPhone:      '+1 310 555 0303',
        },
        history: {
            tryProcedureVisa: '1',
            procedureDate:    '2022-04-10',
            visaApproved:     '0',
        },
        visa: {
            lastVisa:       'B1234567',
            expeditionDate: '2015-06-01',
            expirationDate: '2025-06-01',
        },
        details: {
            travel_date:      '2025-07-15',
            addressEEUU:      { street: '123 Main Street', number: '4B', city: 'Los Angeles', state: 'CA', zip: '90001' },
            travelDateEEUU:   '2025-07-15',
            timeEEUU:         '15 días',
            travelReason:     'Turismo y negocios',
            coverExpenses:    'Recursos propios',
            has_visit_eeuu:   '1',
            lastVisit:        '2019-09-20',
            dateLastVisit:    '10 días',
            other_countries:  '1',
            travelCountries:  'Canadá, Francia, España',
            observations:     'Viaje de placer con familia, regreso confirmado',
            clave_ds_160:     'AA001XB2025MX',
            socialNetworks: [
                { socialNetwork: 'Facebook',  username: 'juancarlos.gonzalez',  email: 'juan.gonzalez@email.com' },
                { socialNetwork: 'Instagram', username: '@jc_gonzalez',         email: 'juan.gonzalez@email.com' },
            ],
        },
        appointments: {
            cas:       { date: '2025-06-20', time: '09:30', city: 'Ciudad de México' },
            consulado: { date: '2025-06-27', time: '11:00', city: 'Ciudad de México' },
        },
    },
    account_email: 'juan.gonzalez@email.com',
    _labels: {
        birthCountry:    'México',
        birthState:      'Ciudad de México',
        passportCountry: 'México',
        passportState:   'Ciudad de México',
        addressCountry:  'México',
        addressState:    'Ciudad de México',
        spouseCountry:   'México',
        spouseState:     'Ciudad de México',
        occupationNames: { '1': 'Empleado' },
    },
};

const MOCK_STATUS = 'Pagado';
const MOCK_TYPE   = 'Visa B1/B2 Turista';
const MOCK_FOLIO  = 'PV20250615120000';

// ── HTML builder ───────────────────────────────────────────────────────────

const buildClientHTML = (client: any, saleStatus: string, saleType: string, idx: number, saleFolio = '', total = 1): string => {
    const pi   = client.personalInformation || {};
    const bp   = pi.birthplace              || {};
    const pp   = pi.passport                || {};
    const ci   = client.contactInformation  || {};
    const addr = ci.address                 || {};
    const fi   = client.familiarInformation || {};
    const spouse = pi.spouse                || {};
    const js   = client.jobsSchools         || {};
    const gi   = client.generalInformation  || {};
    const res  = gi.residence               || {};
    const hist = gi.history                 || {};
    const vsa  = gi.visa                    || {};
    const det  = gi.details                 || {};
    const appt = gi.appointments             || {};
    const lbl  = client._labels             || {};

    const stamp    = getStamp(saleStatus);
    const gMap: Record<string, string> = { M: 'Masculino', F: 'Femenino', O: 'Otro' };
    const gender   = gMap[pi.sex] || esc(pi.sex) || '—';
    const fullName = [pi.names, pi.lastname1, pi.lastname2].filter(Boolean).map(esc).join(' ');
    const stColor  = stamp ? stamp.color : '#475569';
    const stBg     = stamp ? `${stamp.color}1a` : '#f1f5f9';

    const F = 12;
    const P = 4;

    // Sectioned box: dark title bar + content
    const box = (title: string, content: string) =>
        `<div style="border:1px solid #cbd5e1;border-radius:2px;overflow:hidden;margin-bottom:4px;page-break-inside:avoid;">
            <div style="background:#1e293b;color:#e2e8f0;font-size:9px;font-weight:700;
                padding:2px 7px;text-transform:uppercase;letter-spacing:0.7px;">${title}</div>
            <div>${content}</div>
        </div>`;

    const groupLabel = (l: string) =>
        `<div style="width:100%;padding:2px 6px;font-size:${F}px;font-weight:700;color:#1d4ed8;
            background:#f8fafc;border-bottom:1px solid #e2e8f0;box-sizing:border-box;">${l}</div>`;

    // Field cell with label + value
    const cell = (l: string, v: string, w = '50%') =>
        `<div style="width:${w};padding:${P}px 6px;border-bottom:1px solid #f1f5f9;
            border-right:1px solid #f1f5f9;font-size:${F}px;box-sizing:border-box;
            word-break:break-word;">
            <span style="color:#64748b;white-space:nowrap;">${l}:</span>
            <span style="color:#0f172a;font-weight:600;margin-left:2px;">${v || '—'}</span>
        </div>`;

    const cellFull = (l: string, v: string) =>
        `<div style="width:100%;padding:${P}px 6px;border-bottom:1px solid #f1f5f9;
            font-size:${F}px;box-sizing:border-box;word-break:break-word;">
            <span style="color:#64748b;">${l}:</span>
            <span style="color:#0f172a;font-weight:600;margin-left:2px;">${v || '—'}</span>
        </div>`;

    const row = (...cells: string[]) =>
        `<div style="display:flex;flex-wrap:wrap;">${cells.join('')}</div>`;

    const tbl = (headers: string[], rows: string[][]) => {
        if (!rows.length)
            return `<p style="font-size:${F}px;padding:3px 6px;color:#94a3b8;font-style:italic;">Sin datos</p>`;
        return `<table style="width:100%;border-collapse:collapse;font-size:${F}px;">
            <thead><tr>${headers.map(h =>
                `<th style="padding:${P}px 6px;background:#f8fafc;border:1px solid #e2e8f0;
                    text-align:left;font-weight:700;color:#334155;">${h}</th>`
            ).join('')}</tr></thead>
            <tbody>${rows.map(r =>
                `<tr>${r.map(c =>
                    `<td style="padding:${P}px 6px;border:1px solid #e2e8f0;color:#0f172a;">${c || '—'}</td>`
                ).join('')}</tr>`
            ).join('')}</tbody>
        </table>`;
    };

    // ── Header ─────────────────────────────────────────────────────────────

    const stampOverlay = stamp
        ? `<div style="position:absolute;top:8px;right:14px;border:3px solid ${stamp.color};
                color:${stamp.color};padding:4px 14px;font-size:15px;font-weight:bold;
                transform:rotate(-12deg);opacity:0.6;border-radius:3px;letter-spacing:2px;">${stamp.text}</div>`
        : '';

    const header = `
        <div style="position:relative;background:#1e293b;padding:10px 16px 8px;margin-bottom:5px;border-radius:3px;page-break-inside:avoid;">
            ${stampOverlay}
            <p style="text-align:left;font-size:8px;color:#64748b;margin:0;">Folio:&nbsp;${esc(saleFolio) || '—'}</p>
            <p style="text-align:center;font-size:10px;font-weight:700;color:#94a3b8;
                text-transform:uppercase;letter-spacing:1px;margin:0 0 2px;">Detalle de Trámite de Visa</p>
            <p style="text-align:center;font-size:16px;font-weight:700;color:#f8fafc;margin:0 0 6px;">${fullName || '—'}</p>
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                <span style="background:#334155;padding:2px 12px;border-radius:20px;font-size:10px;color:#94a3b8;">
                    Tipo:&nbsp;<strong style="color:#f1f5f9;">${esc(saleType) || '—'}</strong>
                </span>
                <span style="background:${stBg};border:1px solid ${stColor}55;padding:2px 12px;
                    border-radius:20px;font-size:10px;color:${stColor};">
                    Estado:&nbsp;<strong>${esc(saleStatus) || '—'}</strong>
                </span>
            </div>
        </div>`;

    // ── DS-160 bar ─────────────────────────────────────────────────────────

    const ds160bar = `
        <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:2px;
            padding:5px 10px;margin-bottom:5px;display:flex;align-items:center;flex-wrap:wrap;gap:0;">
            <span style="font-size:9px;font-weight:700;color:#1d4ed8;text-transform:uppercase;
                letter-spacing:0.7px;padding-right:12px;margin-right:12px;
                border-right:2px solid #bfdbfe;white-space:nowrap;">DS-160</span>
            <span style="font-size:${F}px;padding:0 12px;border-right:1px solid #bfdbfe;
                flex:1;min-width:140px;white-space:nowrap;overflow:hidden;">
                <span style="color:#6b7280;">Email:</span>
                <strong style="color:#1e293b;">&nbsp;${esc(client.account_email) || '—'}</strong>
            </span>
            <span style="font-size:${F}px;padding:0 12px;flex:1;min-width:120px;
                white-space:nowrap;overflow:hidden;">
                <span style="color:#6b7280;">Clave DS-160:</span>
                <strong style="color:#1e293b;">&nbsp;${esc(det.clave_ds_160) || '—'}</strong>
            </span>
        </div>`;

    // ── Citas (CAS / Consulado) ──────────────────────────────────────────────

    const appointmentsBox = box('Citas',
        groupLabel('CAS') +
        row(
            cell('Fecha', fmtDate(appt.cas?.date),    '33.33%'),
            cell('Hora',  esc(appt.cas?.time) || '—', '33.33%'),
            cell('Sede',  esc(appt.cas?.city) || '—', '33.33%'),
        ) +
        groupLabel('Consulado') +
        row(
            cell('Fecha', fmtDate(appt.consulado?.date),    '33.33%'),
            cell('Hora',  esc(appt.consulado?.time) || '—', '33.33%'),
            cell('Sede',  esc(appt.consulado?.city) || '—', '33.33%'),
        )
    );

    // ── Sections ───────────────────────────────────────────────────────────

    const personalBox = box('Datos Personales',
        row(
            cell('Nombre(s)',    esc(pi.names),             '34%'),
            cell('Ap. Paterno',  esc(pi.lastname1),         '33%'),
            cell('Ap. Materno',  esc(pi.lastname2) || '—', '33%'),
        ) +
        row(
            cell('F. Nacimiento',fmtDate(pi.birthdate),     '50%'),
            cell('Género',       gender,                    '50%'),
            cell('CURP',         esc(pi.curp),              '50%'),
            cell('Estado Civil', esc(pi.civilStatus),       '50%'),
        )
    );

    const birthBox = box('Lugar de Nacimiento',
        row(
            cell('País',         esc(lbl.birthCountry), '50%'),
            cell('Estado',       esc(lbl.birthState),   '50%'),
            cell('Ciudad',       esc(bp.city),          '50%'),
            cell('Nacionalidad', esc(bp.nationality),   '50%'),
        )
    );

    const langBox = box('Idiomas',
        tbl(['Idioma', '%'], (pi.languages || []).map((l: any) => [esc(l.language), `${l.percentage}%`]))
    );

    const spouseBox = spouse.names ? box('Cónyuge',
        row(
            cell('Nombre completo', esc(spouse.names),                          '100%'),
            cell('F. Nacimiento',   fmtDate(spouse.birthdate),                  '50%'),
            cell('¿Tiene visa?',    yesNo(spouse.hasVisa),                      '50%'),
        ) +
        row(
            cell('País nacimiento', esc(lbl.spouseCountry) || '—',              '50%'),
            cell('Estado nacimiento', esc(lbl.spouseState) || '—',              '50%'),
        )
    ) : '';

    // ── Passport (full width, 2 rows of 3) ────────────────────────────────

    const passportBox = box('Pasaporte',
        row(
            cell('No. Pasaporte',   esc(pp.number),                               '33.33%'),
            cell('F. Expedición',   fmtDate(pp.expedition_date),                  '33.33%'),
            cell('F. Caducidad',    fmtDate(pp.expiration_date),                  '33.34%'),
        ) +
        row(
            cell('País expedición', esc(lbl.passportCountry),                     '50%'),
            cell('Estado expd.',    esc(lbl.passportState),                       '50%'),
            cell('Ciudad expd.',    esc(pp.expedition_city || pp.city_expedition), '50%'),
        )
    );

    // ── Address (full width) ───────────────────────────────────────────────

    const addressBox = box('Domicilio',
        row(
            cell('Calle',    esc(addr.street),          '60%'),
            cell('No. Int.', esc(addr.noInt)   || '—', '20%'),
            cell('No. Ext.', esc(addr.noExt),           '20%'),
           
        ) +
        row(
             cell('C.P.',     esc(addr.postCode),       '20%'),
            cell('Colonia',  esc(addr.colony),          '80%'),
            cell('Ciudad',   esc(addr.city),            '50%'),
            cell('País',     esc(lbl.addressCountry),   '50%'),
            cell('Estado',   esc(lbl.addressState),     '50%'),
        )
    );

    const phonesBox = box('Teléfonos',
        tbl(
            ['Tipo', 'Número', 'Descripción'],
            (ci.phones || []).map((p: any) => [esc(p.type), esc(p.number), p.description ? esc(p.description) : '—'])
        )
    );

    const familyBox = box('Familia Directa',
        tbl(
            ['Parentesco', 'Nombre completo', 'F. Nac.', '¿Visa?', '¿Vive en EEUU?', 'Residente/Ciudadano'],
            (fi.relationships || []).map((r: any) => [
                esc(r.relationship), esc(r.full_name), esc(r.birthdate), yesNo(r.has_visa ?? r.hasVisa), yesNo(r.lives_in_usa ?? r.livesInUsa),
                esc(r.citizen_status ?? r.citizenStatus) || '—'
            ])
        )
    );

    const fmtAddress = (a: any) =>
        esc([a?.street, a?.noExt || a?.number, a?.colony, a?.city, a?.zip].filter(Boolean).join(', '));

    const occupationBox = box('Ocupación / Trabajo',
        (js.occupations && js.occupations.length > 0)
            ? js.occupations.map((o: any) =>
                groupLabel(esc(o.name) + (o.is_primary ? ' · Principal' : '')) +
                row(
                    cell('Ocupación',  esc(lbl.occupationNames?.[String(o.occupations_id)] || ''), '33.33%'),
                    cell('Salario',    o.salary ? `$${esc(o.salary)}` : '—',                        '33.33%'),
                    cell('Antigüedad', esc(o.antiquity),                                            '33.33%'),
                    cellFull('Descripción de actividades', esc(o.activities_description)),
                    cellFull('Dirección', fmtAddress(o.address)),
                )
            ).join('')
            : `<p style="font-size:${F}px;padding:3px 6px;color:#94a3b8;font-style:italic;">Sin datos</p>`
    );

    const studiesBox = box('Estudios',
        tbl(['Nombre', 'Grado', '¿Último grado?', 'Dirección', 'Generación'],
            (js.schools || []).map((s: any) => [esc(s.name), esc(s.degree_level), yesNo(s.is_last_degree), fmtAddress(s.address), esc(s.period)])
        )
    );

    const lodgingBox = box('Hospedaje EE.UU.',
        row(
            cell('Nombre ref.',           esc(res.fullName),               '50%'),
            cell('Parentesco',            esc(res.relationship) || '—',    '50%'),
            cell('¿Ciudadano o residente?', esc(res.citizen_status) || '—', '50%'),        
            cell('Tel. Personal', esc(res.personalPhone),    '50%'),
            cell('Tel. Trabajo',  esc(res.workPhone) || '—', '50%'),
            cell('Tel. Celular',  esc(res.celPhone)  || '—', '50%'),
        )
    );

    // ── Travel Info (full width) ───────────────────────────────────────────

    const travelBox = box('Información de Viaje',
        row(
            cellFull('Dirección en EE.UU.', fmtAddress(det.addressEEUU)),
            cell('F. viaje EE.UU.',  fmtDate(det.travelDateEEUU), '33.33%'),
            cell('Tiempo estancia',  esc(det.timeEEUU),           '33.33%'),
            cell('Motivo',           esc(det.travelReason),       '33.33%'),
            cell('Cubre gastos',     esc(det.coverExpenses),      '50%'),
            cell('¿Visitó EE.UU.?',  yesNo(det.has_visit_eeuu),  '50%'),
            cell('Última visita',    fmtDate(det.lastVisit),      '50%'),
            cell('Duración visita',  esc(det.dateLastVisit),      '50%'),
            cell('¿Otros países?',   yesNo(det.other_countries),  '100%'),
            cellFull('Países visitados', det.travelCountries ? esc(det.travelCountries) : '—'),
            cellFull('Observaciones', esc(det.observations)),
        )
    );

    // ── Visa History (full width) ──────────────────────────────────────────

    const visaHistBox = box('Historial de Visa',
        row(
            cell('¿Intentó tramitar?', yesNo(hist.tryProcedureVisa), '33.33%'),
            cell('Fecha trámite',      fmtDate(hist.procedureDate),  '33.33%'),
            cell('¿Aprobada?',         yesNo(hist.visaApproved),     '33.33%'),
            cell('No. visa anterior',  esc(vsa.lastVisa) || '—',    '33.33%'),
            cell('F. Exp. visa ant.',  fmtDate(vsa.expeditionDate),  '33.33%'),
            cell('F. Vcto. visa ant.', fmtDate(vsa.expirationDate),  '33.33%'),
        )
    );

    // ── Social Networks (full width) ───────────────────────────────────────

    const socialBox = box('Redes Sociales',
        tbl(
            ['Red Social', 'Usuario / Página', 'Correo'],
            (det.socialNetworks || []).map((s: any) => [esc(s.socialNetwork), esc(s.username), esc(s.email)])
        )
    );

    // ── Assemble ───────────────────────────────────────────────────────────

    const row2col = (a: string, b: string, splitA = '50%', splitB = '50%') =>
        `<div style="display:flex;gap:4px;margin-bottom:0;">
            <div style="width:${splitA};min-width:0;">${a}</div>
            <div style="width:${splitB};min-width:0;">${b}</div>
        </div>`;

    // A <thead> repeats on every printed page (unlike a plain <div>), so the
    // header stays visible when a client's content spans multiple pages.
    // The footer info instead feeds a CSS running element (see print stylesheet
    // in handlePrint) so it stays pinned to the bottom margin of every page,
    // rather than trailing right after the content like a <tfoot> row does.
    const footerMarker = `<div class="vp-footer-marker" style="display:none;">
        Folio: ${esc(saleFolio) || '—'} — ${fullName || '—'}${total > 1 ? ` — Solicitante ${idx + 1} de ${total}` : ''}
    </div>`;

    const pageBreak = idx > 0 ? 'page-break-before:always;' : '';
    return `${footerMarker}<table style="${pageBreak}width:100%;border-collapse:collapse;">
        <thead><tr><td style="padding:0;border:none;">${header}</td></tr></thead>
        <tbody><tr><td style="padding:0;border:none;">
            ${ds160bar}
            ${appointmentsBox}
            ${personalBox}
            ${birthBox}
            ${spouseBox}
            ${row2col(langBox, phonesBox)}
            ${passportBox}
            ${addressBox}
            ${familyBox}
            ${occupationBox}
            ${studiesBox}
            ${lodgingBox}
            ${travelBox}
            ${visaHistBox}
            ${socialBox}
        </td></tr></tbody>
    </table>`;
};

// ── Component ──────────────────────────────────────────────────────────────

const VisaDetailPrint = ({ open, onClose, clients, saleStatus, saleType, saleFolio = '' }: Props) => {
    const countries = useAddressStore(state => state.countries);
    const [selectedTab, setSelectedTab]         = useState(0);
    const [resolvedClients, setResolvedClients] = useState<any[]>([]);
    const [loading, setLoading]                 = useState(false);
    const [showMock, setShowMock]               = useState(false);

    const isMockMode = showMock || clients.length === 0;

    const resolveData = async () => {
        if (!clients.length) return;
        setLoading(true);
        try {
            const occRes  = await occupationsList();
            const occList = occRes?.data || [];

            const resolved = await Promise.all(
                clients.map(async (client) => {
                    const ids = {
                        birth:    client.personalInformation?.birthplace?.country as number,
                        passport: client.personalInformation?.passport?.country_expedition as number,
                        address:  client.contactInformation?.address?.country as number,
                        spouse:   client.personalInformation?.spouse?.country as number,
                    };
                    const uniqueIds = [...new Set(Object.values(ids).filter(Boolean))];
                    const stateMap: Record<string, any[]> = {};

                    await Promise.allSettled(
                        uniqueIds.map(async (id) => {
                            const res = await getStates(id as number);
                            if (res?.success) stateMap[String(id)] = res.data;
                        })
                    );

                    const lbl = (list: any[], id: any) =>
                        list?.find((o: any) => String(o.value) === String(id))?.label || String(id || '—');

                    return {
                        ...client,
                        _labels: {
                            birthCountry:    lbl(countries, ids.birth),
                            birthState:      lbl(stateMap[String(ids.birth)]    || [], client.personalInformation?.birthplace?.state),
                            passportCountry: lbl(countries, ids.passport),
                            passportState:   lbl(stateMap[String(ids.passport)] || [], client.personalInformation?.passport?.state_expedition),
                            addressCountry:  lbl(countries, ids.address),
                            addressState:    lbl(stateMap[String(ids.address)]  || [], client.contactInformation?.address?.state),
                            spouseCountry:   lbl(countries, ids.spouse),
                            spouseState:     lbl(stateMap[String(ids.spouse)]    || [], client.personalInformation?.spouse?.state),
                            occupationNames: Object.fromEntries(
                                (client.jobsSchools?.occupations || []).map((occ: any) => [
                                    String(occ.occupations_id),
                                    occList.find((o: any) => String(o.id) === String(occ.occupations_id))?.name || '',
                                ])
                            ),
                        },
                    };
                })
            );
            setResolvedClients(resolved);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) { setSelectedTab(0); setShowMock(false); resolveData(); }
    }, [open]);

    const handlePrint = () => {
        let data: any[];
        let status: string;
        let type: string;
        let folio: string;

        if (isMockMode) {
            data   = [MOCK_CLIENT];
            status = MOCK_STATUS;
            type   = MOCK_TYPE;
            folio  = MOCK_FOLIO;
        } else {
            data   = resolvedClients.length ? resolvedClients : clients;
            status = saleStatus;
            type   = saleType;
            folio  = saleFolio;
        }

        const body = data.map((c, i) => buildClientHTML(c, status, type, i, folio, data.length)).join('');
        const win  = window.open('', '_blank', 'width=960,height=800');
        if (!win) return;
        win.document.write(`<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
            <title>Detalle de Visa</title>
            <style>
                *{box-sizing:border-box;margin:0;padding:0;}
                body{font-family:Arial,sans-serif;font-size:12px;padding:10px;}
                @media print{
                    body{padding:0;}
                    .vp-footer-marker{display:block;position:running(pageFooter);}
                    @page{
                        margin:8mm;
                        @bottom-left{
                            content: element(pageFooter);
                            font-size: 8px;
                            color: #94a3b8;
                        }
                        @bottom-center{
                            content: "Página " counter(page) " de " counter(pages);
                            font-size: 8px;
                            color: #94a3b8;
                        }
                    }
                }
            </style>
            </head><body>${body}</body></html>`);
        win.document.close();
        win.focus();
        setTimeout(() => { win.print(); win.close(); }, 400);
    };

    const displayClients  = isMockMode ? [MOCK_CLIENT]  : (resolvedClients.length ? resolvedClients : clients);
    const displayStatus   = isMockMode ? MOCK_STATUS    : saleStatus;
    const displayType     = isMockMode ? MOCK_TYPE      : saleType;
    const displayFolio    = isMockMode ? MOCK_FOLIO     : saleFolio;
    const currentClient   = displayClients[selectedTab];
    const previewHtml     = currentClient ? buildClientHTML(currentClient, displayStatus, displayType, 0, displayFolio, displayClients.length) : '';

    return (
        <Modal full open={open} onClose={onClose}>
            <Modal.Header>
                <Modal.Title>Vista previa — Detalle de Trámite de Visa</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto', background: '#f1f5f9', padding: '16px' }}>
                {loading && (
                    <div className="text-center py-10 text-gray-400 text-sm">Cargando datos...</div>
                )}
                {!loading && (
                    <>
                        <div className="flex justify-between items-center mb-3">
                            {clients.length > 1 && !isMockMode ? (
                                <div className="flex gap-2 flex-wrap">
                                    {clients.map((c: any, i: number) => (
                                        <button
                                            key={i}
                                            className={`px-3 py-1 text-sm rounded border transition-colors ${
                                                selectedTab === i
                                                    ? 'bg-blue-600 text-white border-blue-600'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                            }`}
                                            onClick={() => setSelectedTab(i)}
                                        >
                                            {c.personalInformation?.names || `Cliente ${i + 1}`}
                                        </button>
                                    ))}
                                </div>
                            ) : <div />}

                            {clients.length > 0 && (
                                <button
                                    className={`px-3 py-1 text-xs rounded border transition-colors ${
                                        isMockMode
                                            ? 'bg-amber-500 text-white border-amber-500'
                                            : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50'
                                    }`}
                                    onClick={() => { setShowMock(!showMock); setSelectedTab(0); }}
                                >
                                    {isMockMode ? 'Ver datos reales' : 'Simulación'}
                                </button>
                            )}
                        </div>

                        {isMockMode && (
                            <div className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mb-3">
                                Mostrando datos de simulación para previsualizar el diseño.
                            </div>
                        )}

                        {currentClient && (
                            <div
                                style={{
                                    background: '#fff',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '4px',
                                    padding: '12px',
                                    maxWidth: '860px',
                                    margin: '0 auto',
                                    boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
                                }}
                                dangerouslySetInnerHTML={{ __html: previewHtml }}
                            />
                        )}
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <div className='mt-3'>
                    <Button  onClick={handlePrint}>Imprimir</Button>
                    <Button appearance="subtle" onClick={onClose}>Cerrar</Button>
                </div>
            </Modal.Footer>
        </Modal>
    );
};

export default VisaDetailPrint;
