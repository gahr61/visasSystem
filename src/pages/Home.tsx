import { useCallback, useEffect, useRef, useState } from "react";
import { Col, DateRangePicker, Grid, Panel, Row } from "rsuite";
import { Navigate } from "react-router-dom";
import moment from "moment";
import {
    PieChart, Pie, Cell, Tooltip as RechartTooltip,
    Legend, ResponsiveContainer, BarChart, Bar,
    XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
    HiOutlineCurrencyDollar, HiOutlineDocumentText,
    HiOutlineCalendarDays, HiOutlineUsers, HiOutlineBanknotes,
    HiOutlineUserGroup, HiOutlineEnvelope, HiOutlineKey,
    HiOutlineClock, HiOutlineChartBar, HiOutlineShoppingCart,
} from "react-icons/hi2";
import { useUserStore } from "../utils/stores/useUserStore";
import { ILoader } from "../utils/interfaces/function";
import { IBranchSales, IDashboardData, IEmployeeRanking, IProcedureStatus, ISalesType } from "../utils/interfaces/dashboard";
import { getDashboardIndicators } from "../utils/services/dashboard";
import { formatPrice } from "../utils/functions";
import Loader from "../components/common/Loader";

// ── Paletas de color ──────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, string> = {
    Inicio:      '#94a3b8',
    'Por pagar': '#f59e0b',
    Informado:   '#3b82f6',
    Pagado:      '#22c55e',
    Entregado:   '#a855f7',
    Finalizado:  '#d1d5db',
};

const TYPE_COLORS: Record<string, string> = {
    'Venta General': '#3b82f6',
    'Familiar':      '#22c55e',
    'Individual':    '#f59e0b',
    'Grupo':         '#a855f7',
};

const BRANCH_PALETTE = ['#14b8a6', '#3b82f6', '#f97316', '#a855f7', '#ef4444', '#eab308', '#ec4899', '#6366f1'];

// ── StatCard ─────────────────────────────────────────────────────────────────

type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    color: string;
    icon: React.ReactNode;
};

const StatCard = ({ title, value, subtitle, color, icon }: StatCardProps) => (
    <div style={{
        height: 120,
        border: '1px solid #f0f0f0',
        borderRadius: 10,
        padding: '16px 20px',
        background: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,.05)',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        borderTop: `3px solid ${color}`,
    }}>
        <div style={{
            width: 48, height: 48, borderRadius: 10, flexShrink: 0,
            background: `${color}18`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, fontSize: 22,
        }}>
            {icon}
        </div>
        <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {title}
            </p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#111827', lineHeight: 1, marginBottom: subtitle ? 2 : 0 }}>
                {value}
            </p>
            {subtitle && (
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{subtitle}</p>
            )}
        </div>
    </div>
);

// ── SectionLabel ─────────────────────────────────────────────────────────────

const SectionLabel = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, marginTop: 4 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {label}
        </span>
        <div style={{ flex: 1, height: 1, background: '#f3f4f6' }} />
    </div>
);

const EMPTY_CHART = (msg: string) => (
    <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#9ca3af', fontSize: 13 }}>{msg}</p>
    </div>
);

// ── Gráfica de dona — Trámites por estado ─────────────────────────────────────

const DonutChart = ({ items, title }: { items: IProcedureStatus[]; title: string }) => {
    const chartData = items.map(i => ({ name: i.status, value: i.count }));
    const total     = chartData.reduce((s, i) => s + i.value, 0);

    return (
        <Panel bordered header={<span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{title}</span>}>
            {chartData.length === 0 ? EMPTY_CHART('Sin trámites registrados') : (
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="46%" innerRadius={75} outerRadius={105} paddingAngle={3} dataKey="value">
                                {chartData.map((entry, i) => (
                                    <Cell key={i} fill={STATUS_COLORS[entry.name] ?? '#94a3b8'} stroke="none" />
                                ))}
                            </Pie>
                            <RechartTooltip
                                formatter={(v) => {
                                    const n = Number(v ?? 0);
                                    return [`${n} trámite${n !== 1 ? 's' : ''} (${total > 0 ? Math.round(n / total * 100) : 0}%)`, ''];
                                }}
                                contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
                            />
                            <Legend iconType="circle" iconSize={9} formatter={(value) => <span style={{ fontSize: 12, color: '#374151' }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Panel>
    );
};

// ── Gráfica de dona — Ventas por tipo ────────────────────────────────────────

const SalesByTypeChart = ({ items }: { items: ISalesType[] }) => {
    const total = items.reduce((s, i) => s + i.count, 0);
    const chartData = items.map(i => ({ name: i.type, value: i.count, amount: i.amount }));

    return (
        <Panel bordered header={<span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Ventas por tipo</span>}>
            {chartData.length === 0 ? EMPTY_CHART('Sin ventas en el período') : (
                <div style={{ height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} cx="50%" cy="46%" innerRadius={75} outerRadius={105} paddingAngle={3} dataKey="value">
                                {chartData.map((entry, i) => (
                                    <Cell key={i} fill={TYPE_COLORS[entry.name] ?? '#94a3b8'} stroke="none" />
                                ))}
                            </Pie>
                            <RechartTooltip
                                formatter={(v, _name, item) => {
                                    const n = Number(v ?? 0);
                                    const pct = total > 0 ? Math.round(n / total * 100) : 0;
                                    const amt = formatPrice(Number((item as { payload?: { amount?: number } }).payload?.amount ?? 0));
                                    return [`${n} venta${n !== 1 ? 's' : ''} (${pct}%) · ${amt}`, ''];
                                }}
                                contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
                            />
                            <Legend iconType="circle" iconSize={9} formatter={(value) => <span style={{ fontSize: 12, color: '#374151' }}>{value}</span>} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            )}
        </Panel>
    );
};

// ── Gráfica de barras — Ventas por sucursal ───────────────────────────────────

const BranchChart = ({ rows, title }: { rows: IBranchSales[]; title: string }) => (
    <Panel bordered header={<span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>{title}</span>}>
        {rows.length === 0 ? EMPTY_CHART('Sin ventas en el período') : (
            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rows} layout="vertical" margin={{ top: 5, right: 32, left: 8, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} />
                        <RechartTooltip
                            cursor={{ fill: '#f9fafb' }}
                            formatter={(v, _name, item) => {
                                const n = Number(v ?? 0);
                                const amt = formatPrice(Number((item as { payload?: { amount?: number } }).payload?.amount ?? 0));
                                return [`${n} venta${n !== 1 ? 's' : ''} · ${amt}`, ''];
                            }}
                            contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
                        />
                        <Bar dataKey="count" radius={[0, 6, 6, 0]} maxBarSize={28} isAnimationActive={true}>
                            {rows.map((_entry, i) => (
                                <Cell key={i} fill={BRANCH_PALETTE[i % BRANCH_PALETTE.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}
    </Panel>
);

// ── Gráfica de barras — Ranking de vendedores ─────────────────────────────────

const RankingChart = ({ rows }: { rows: IEmployeeRanking[] }) => (
    <Panel bordered header={<span style={{ fontWeight: 600, fontSize: 14, color: '#374151' }}>Ranking de vendedores</span>}>
        {rows.length === 0 ? EMPTY_CHART('Sin ventas en el período') : (
            <div style={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rows} layout="vertical" margin={{ top: 5, right: 24, left: 8, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="name" width={115} tick={{ fontSize: 12, fill: '#374151' }} axisLine={false} tickLine={false} />
                        <RechartTooltip
                            cursor={{ fill: '#f9fafb' }}
                            formatter={(v) => {
                                const n = Number(v ?? 0);
                                return [`${n} venta${n !== 1 ? 's' : ''}`, ''];
                            }}
                            contentStyle={{ borderRadius: 8, border: '1px solid #f0f0f0', fontSize: 13 }}
                        />
                        <Bar dataKey="sales_count" fill="#3b82f6" radius={[0, 6, 6, 0]} maxBarSize={28} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        )}
    </Panel>
);

// ── Fechas por defecto ────────────────────────────────────────────────────────

const defaultStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const defaultEnd   = new Date();

// ── Home ─────────────────────────────────────────────────────────────────────

const Home = () => {
    const userData = useUserStore(store => store.user);
    const loader   = useRef<ILoader>(null);
    const [data, setData]           = useState<IDashboardData | null>(null);
    const [dateRange, setDateRange] = useState<[Date, Date]>([defaultStart, defaultEnd]);

    const isVendedor = userData.role === 'vendedor';

    const fetchData = useCallback((range: [Date, Date]) => {
        loader.current?.handleShow('Cargando indicadores...');
        getDashboardIndicators({
            start_date: moment(range[0]).format('YYYY-MM-DD'),
            end_date:   moment(range[1]).format('YYYY-MM-DD'),
        })
            .then(res => { if (res.success) setData(res.data); })
            .finally(() => loader.current?.handleClose());
    }, []);

    useEffect(() => { fetchData(dateRange); }, []);

    if (userData.role === 'cliente') {
        return <Navigate to="/procedures/visa/client/list" replace />;
    }

    const handleDateChange = (value: [Date, Date] | null) => {
        if (!value) return;
        setDateRange(value);
        fetchData(value);
    };

    const periodLabel = `${moment(dateRange[0]).format('DD/MM/YYYY')} — ${moment(dateRange[1]).format('DD/MM/YYYY')}`;

    return (
        <Grid fluid style={{ padding: '20px 24px' }}>

            {/* ── Encabezado ───────────────────────────────────────── */}
            <Row style={{ marginBottom: 24 }}>
                <Col xs={24} sm={14} style={{ marginBottom: 8 }}>
                    <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>
                        {isVendedor ? 'Mi desempeño' : 'Panel de control'}
                    </h1>
                    <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 3 }}>{periodLabel}</p>
                </Col>
                <Col xs={24} sm={10} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <DateRangePicker
                        value={dateRange}
                        onChange={handleDateChange}
                        format="dd/MM/yyyy"
                        placement="bottomEnd"
                        cleanable={false}
                        character=" — "
                    />
                </Col>
            </Row>

            {data && (
                <>
                    {/* ════════════════════════════════════════
                        VISTA VENDEDOR
                    ════════════════════════════════════════ */}
                    {isVendedor && (
                        <>
                            <Row style={{ marginBottom: 12 }}>
                                {([
                                    { title: 'Mis ventas',           value: data.my_sales.count,                   subtitle: `${data.my_sales.count} trámite${data.my_sales.count !== 1 ? 's' : ''}`, color: '#3b82f6', icon: <HiOutlineShoppingCart /> },
                                    { title: 'Monto de mis ventas',  value: formatPrice(data.my_sales.amount),     subtitle: undefined,                                                                   color: '#22c55e', icon: <HiOutlineCurrencyDollar /> },
                                    { title: 'Mis trámites activos', value: data.my_procedures.active,             subtitle: undefined,                                                                   color: '#f97316', icon: <HiOutlineDocumentText /> },
                                ] as StatCardProps[]).map(card => (
                                    <Col key={card.title} xs={24} sm={12} md={8} style={{ marginBottom: 12, paddingLeft: 6, paddingRight: 6 }}>
                                        <StatCard {...card} />
                                    </Col>
                                ))}
                            </Row>

                            <Row style={{ marginBottom: 24 }}>
                                {([
                                    { title: 'Citas próximas',  value: data.my_upcoming_appointments,           subtitle: 'próximos 7 días',                                              color: '#a855f7', icon: <HiOutlineCalendarDays /> },
                                    { title: 'Mis comisiones',  value: formatPrice(data.my_commissions.amount), subtitle: `${data.my_commissions.count} comisiones`,                      color: '#eab308', icon: <HiOutlineBanknotes /> },
                                    { title: 'Clientes nuevos', value: data.my_new_clients,                     subtitle: undefined,                                                     color: '#14b8a6', icon: <HiOutlineUsers /> },
                                ] as StatCardProps[]).map(card => (
                                    <Col key={card.title} xs={24} sm={12} md={8} style={{ marginBottom: 12, paddingLeft: 6, paddingRight: 6 }}>
                                        <StatCard {...card} />
                                    </Col>
                                ))}
                            </Row>

                            <Row>
                                <Col xs={24} md={12} style={{ marginBottom: 16, paddingLeft: 6, paddingRight: 6 }}>
                                    <DonutChart items={data.my_procedures.by_status} title="Mis trámites por estado" />
                                </Col>
                                <Col xs={24} md={12} style={{ marginBottom: 16, paddingLeft: 6, paddingRight: 6 }}>
                                    <BranchChart rows={data.my_sales_by_branch ?? []} title="Mis ventas por sucursal" />
                                </Col>
                            </Row>
                        </>
                    )}

                    {/* ════════════════════════════════════════
                        VISTA ADMIN / GERENCIA
                    ════════════════════════════════════════ */}
                    {!isVendedor && (
                        <>
                            {/* ── Ventas ──────────────────────────────── */}
                            <SectionLabel label="Ventas" />
                            <Row style={{ marginBottom: 16 }}>
                                {([
                                    { title: 'Total ventas',              value: data.total_sales?.count ?? 0,              subtitle: `${data.total_sales?.count ?? 0} trámite${(data.total_sales?.count ?? 0) !== 1 ? 's' : ''}`, color: '#3b82f6', icon: <HiOutlineShoppingCart /> },
                                    { title: 'Monto total facturado',     value: formatPrice(data.total_sales?.amount ?? 0), subtitle: undefined,                                                                                       color: '#22c55e', icon: <HiOutlineCurrencyDollar /> },
                                    { title: 'Total comisiones',          value: formatPrice(data.total_commissions ?? 0),   subtitle: `${data.total_commissions_count ?? 0} comisiones`,                                               color: '#eab308', icon: <HiOutlineBanknotes /> },
                                    { title: 'Ventas pendientes de pago', value: data.pending_payment ?? 0,                  subtitle: undefined,                                                                                       color: '#ef4444', icon: <HiOutlineClock /> },
                                ] as StatCardProps[]).map(card => (
                                    <Col key={card.title} xs={24} sm={12} md={6} style={{ marginBottom: 12, paddingLeft: 6, paddingRight: 6 }}>
                                        <StatCard {...card} />
                                    </Col>
                                ))}
                            </Row>

                            {/* ── Gráficas de ventas ──────────────────── */}
                            <Row style={{ marginBottom: 24 }}>
                                <Col xs={24} md={12} style={{ marginBottom: 16, paddingLeft: 6, paddingRight: 6 }}>
                                    <BranchChart rows={data.sales_by_branch ?? []} title="Ventas por sucursal" />
                                </Col>
                                <Col xs={24} md={12} style={{ marginBottom: 16, paddingLeft: 6, paddingRight: 6 }}>
                                    <SalesByTypeChart items={data.sales_by_type ?? []} />
                                </Col>
                            </Row>

                            {/* ── Clientes y trámites ─────────────────── */}
                            <SectionLabel label="Clientes y trámites" />
                            <Row style={{ marginBottom: 16 }}>
                                {([
                                    { title: 'Clientes nuevos',         value: data.new_clients ?? 0,               subtitle: 'en el período', color: '#14b8a6', icon: <HiOutlineUsers /> },
                                    { title: 'Total de clientes',       value: data.total_clients ?? 0,             subtitle: undefined,       color: '#6366f1', icon: <HiOutlineUserGroup /> },
                                    { title: 'Trámites activos',        value: data.total_active_procedures ?? 0,   subtitle: undefined,       color: '#f97316', icon: <HiOutlineDocumentText /> },
                                    { title: 'Citas próximas (7 días)', value: data.all_upcoming_appointments ?? 0, subtitle: undefined,       color: '#a855f7', icon: <HiOutlineCalendarDays /> },
                                ] as StatCardProps[]).map(card => (
                                    <Col key={card.title} xs={24} sm={12} md={6} style={{ marginBottom: 12, paddingLeft: 6, paddingRight: 6 }}>
                                        <StatCard {...card} />
                                    </Col>
                                ))}
                            </Row>

                            {/* ── Gráficas de trámites y empleados ────── */}
                            <Row style={{ marginBottom: 24 }}>
                                <Col xs={24} md={12} style={{ marginBottom: 16, paddingLeft: 6, paddingRight: 6 }}>
                                    <DonutChart items={data.all_procedures_by_status ?? []} title="Trámites por estado" />
                                </Col>
                                <Col xs={24} md={12} style={{ marginBottom: 16, paddingLeft: 6, paddingRight: 6 }}>
                                    <RankingChart rows={data.employees_ranking ?? []} />
                                </Col>
                            </Row>

                            {/* ── Administrativo ──────────────────────── */}
                            <SectionLabel label="Administrativo" />
                            <Row style={{ marginBottom: 16 }}>
                                {([
                                    { title: 'Empleados activos',                 value: data.active_employees ?? 0, subtitle: undefined,       color: '#6b7280', icon: <HiOutlineChartBar /> },
                                    { title: 'Solicitudes de contacto web',       value: data.web_contacts ?? 0,     subtitle: 'en el período', color: '#ec4899', icon: <HiOutlineEnvelope /> },
                                    { title: 'Tokens de confirmación pendientes', value: data.pending_tokens ?? 0,   subtitle: undefined,       color: '#f59e0b', icon: <HiOutlineKey /> },
                                ] as StatCardProps[]).map(card => (
                                    <Col key={card.title} xs={24} sm={8} style={{ marginBottom: 12, paddingLeft: 6, paddingRight: 6 }}>
                                        <StatCard {...card} />
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </>
            )}

            <Loader ref={loader} />
        </Grid>
    );
};

export default Home;
