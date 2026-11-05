import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Divider, Tabs } from "rsuite";

import Content from "../../../components/common/Content";
import Button from "../../../components/common/Button";
import Toast from "../../../components/common/Toast";
import PassportSaleHeader from "../../../components/ui/procedures/passport/PassportSaleHeader";
import PassportClientCard from "../../../components/ui/procedures/passport/PassportClientCard";
import PassportScheduleModal  from "../../../components/ui/modals/PassportScheduleModal";
import PassportSaleEditModal  from "../../../components/ui/modals/PassportSaleEditModal";

import { IApp } from "../../../utils/interfaces/function";
import { PassportSalesInfo, PassportSalesClientsInfo } from "../../../utils/interfaces/passportSales";
import { passportSalesInfo, passportSalesUpdate } from "../../../utils/services/sales/passport";
import { usePermissionsStore } from "../../../utils/stores/usePermissionsStore";
import { FaPen } from "react-icons/fa6";

const PassportDetails = ({ loader }: IApp) => {
    const navigate = useNavigate();
    const { id }   = useParams<{ id: string }>();
    const canEdit  = usePermissionsStore(state => state.hasPermission)('procedure_passport_update');

    const scheduleRef  = useRef<any>(null);
    const editModalRef = useRef<any>(null);

    const [info, setInfo]       = useState<PassportSalesInfo | null>(null);
    const [clients, setClients] = useState<PassportSalesClientsInfo[]>([]);
    const [activeKey, setActiveKey] = useState('0');

    /**
     * @param keepEdits conserva los cambios sin guardar de las pestañas (estatus,
     * completado, observaciones) al recargar tras guardar un modal
     */
    const onLoad = async (keepEdits: boolean = false) => {
        loader.current?.handleShow('Cargando...');
        const response = await passportSalesInfo(Number(id));
        loader.current?.handleClose();
        if (response?.success) {
            setInfo(response.data);
            setClients(prev => response.data.clients.map(fresh => {
                const local = keepEdits ? prev.find(c => c.process_id === fresh.process_id) : undefined;
                return local
                    ? { ...fresh, process_status: local.process_status, complete: local.complete, observations: local.observations }
                    : fresh;
            }));
        }
    };

    const onUpdateClient = (index: number, updated: PassportSalesClientsInfo) => {
        setClients(prev => prev.map((c, i) => i === index ? updated : c));
    };

    const onOpenSchedule = (client: PassportSalesClientsInfo) => {
        const existing = client.schedule[0];
        scheduleRef.current?.handleShow([{
            clients_id:       client.clients_id,
            clientName:       `${client.names} ${client.lastname1}${client.lastname2 ? ' ' + client.lastname2 : ''}`,
            office:           existing?.office           || '',
            city:             existing?.city             || '',
            appointment_date: existing?.appointment_date || '',
            schedule:         existing?.schedule         || '',
            status:           existing?.status           || '',
            observations:     existing?.observations     || '',
        }]);
    };

    const handleSave = async () => {
        loader.current?.handleShow('Guardando...');
        const response = await passportSalesUpdate(Number(id), {
            clients: clients.map(c => ({
                process_id:     c.process_id,
                observations:   c.observations,
                complete:       c.complete,
                process_status: c.process_status || 'Inicio'
            }))
        });
        loader.current?.handleClose();

        if (response?.success) {
            Toast.fire('Correcto', response.message, 'success');
            return;
        }
        Toast.fire('Error', response.message, 'error');
    };

    useEffect(() => { onLoad(); }, []);

    return (
        <Content
            url="/procedures/passport/details"
            page="Pasaporte"
            subpage="Detalles"
            title="Detalle de trámite de pasaporte"
            autoHeight
        >
            <>
                <PassportScheduleModal
                    ref={scheduleRef}
                    loader={loader}
                    salesId={Number(id)}
                    onSaved={() => onLoad(true)}
                />
                <PassportSaleEditModal
                    ref={editModalRef}
                    loader={loader}
                    salesId={Number(id)}
                    onSaved={() => onLoad(true)}
                />

                {info && (
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <PassportSaleHeader info={info} />
                        </div>
                        {canEdit && (
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    appearance="ghost"
                                    onClick={() => navigate('/procedures/passport/' + id + '/edit')}
                                >
                                    <span className="inline-flex items-center gap-1"><FaPen /> Editar trámite</span>
                                </Button>
                                <Button
                                    size="sm"
                                    appearance="ghost"
                                    onClick={() => editModalRef.current?.handleShow(info)}
                                >
                                    Estatus y abono
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                <Divider className="my-3" />

                <Tabs activeKey={activeKey} onSelect={(k: any) => setActiveKey(k)}>
                    {clients.map((client, index) =>
                        <Tabs.Tab
                            key={index}
                            eventKey={index.toString()}
                            title={`${client.names} ${client.lastname1}`}
                        >
                            <PassportClientCard
                                client={client}
                                readOnly={!canEdit}
                                onChange={(updated) => onUpdateClient(index, updated)}
                                onOpenSchedule={() => onOpenSchedule(client)}
                                onEdit={() => navigate('/procedures/passport/' + id + '/edit')}
                            />
                        </Tabs.Tab>
                    )}
                </Tabs>

                <div className="my-3 flex justify-end gap-2">
                    <Button appearance="default" onClick={() => navigate('/procedures/passport/list')}>Volver</Button>
                    {canEdit && <Button onClick={handleSave}>Guardar</Button>}
                </div>
            </>
        </Content>
    );
};

export default PassportDetails;
