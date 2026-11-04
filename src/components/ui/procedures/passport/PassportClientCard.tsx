import { Col, Divider, Row } from "rsuite";
import Button from "../../../common/Button";
import Input from "../../../common/Input";
import { PassportSalesClientsInfo } from "../../../../utils/interfaces/passportSales";
import moment from "moment";

const selectClass = "py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem] bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer";

type Props = {
    client: PassportSalesClientsInfo;
    onChange: (updated: PassportSalesClientsInfo) => void;
    onOpenSchedule: () => void;
    readOnly?: boolean;
}

const PassportClientCard = ({ client, onChange, onOpenSchedule, readOnly = false }: Props) => {
    const label = "text-xs text-gray-500 block mb-1";
    const info  = "text-sm text-gray-800";

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onChange({ ...client, process_status: e.target.value });
    };

    const onObservationsChange = (e: React.FormEvent<HTMLInputElement>) => {
        onChange({ ...client, observations: e.currentTarget.value });
    };

    const onCompleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...client, complete: e.target.checked });
    };

    return (
        <div className="p-3">
            <Row>
                <Col xs={24} md={12}>
                    <fieldset>
                        <legend className="text-base font-semibold mb-2">Datos del solicitante</legend>
                        <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-sm">
                            <div>
                                <span className={label}>Nombre</span>
                                <span className={info}>{client.names} {client.lastname1}{client.lastname2 ? ' ' + client.lastname2 : ''}</span>
                            </div>
                            <div>
                                <span className={label}>CURP</span>
                                <span className={info}>{client.curp}</span>
                            </div>
                            <div>
                                <span className={label}>F. Nacimiento</span>
                                <span className={info}>{client.birthdate || '—'}</span>
                            </div>
                            <div>
                                <span className={label}>Teléfono</span>
                                <span className={info}>{client.phone || '—'}</span>
                            </div>
                            <div>
                                <span className={label}>Edad</span>
                                <span className={info}>{client.age_type}</span>
                            </div>
                            <div>
                                <span className={label}>Tipo</span>
                                <span className={info}>{client.subtype}</span>
                            </div>
                        </div>

                        <Divider className="my-3" />

                        <legend className="text-base font-semibold mb-2">Pasaporte</legend>
                        <div className="grid grid-cols-3 gap-y-2 gap-x-3 text-sm">
                            <div>
                                <span className={label}>No. Pasaporte</span>
                                <span className={info}>{client.passport_number || '—'}</span>
                            </div>
                            <div>
                                <span className={label}>Expedición</span>
                                <span className={info}>{client.expedition_date || '—'}</span>
                            </div>
                            <div>
                                <span className={label}>Vencimiento</span>
                                <span className={info}>{client.expiration_date || '—'}</span>
                            </div>
                        </div>
                    </fieldset>
                </Col>

                <Col xs={24} md={12}>
                    <fieldset>
                        <legend className="text-base font-semibold mb-2">Estado del proceso</legend>
                        <Row>
                            <Col xs={24} md={14}>
                                <label className={label}>Estatus</label>
                                <select
                                    value={client.process_status || 'Inicio'}
                                    onChange={onStatusChange}
                                    disabled={readOnly}
                                    className={selectClass}
                                >
                                    <option value="Inicio">Inicio</option>
                                    <option value="Informado">Informado</option>
                                    <option value="Entregado">Entregado</option>
                                    <option value="Finalizado">Finalizado</option>
                                </select>
                            </Col>
                            <Col xs={24} md={10} className="flex items-center gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id={"complete_" + client.process_id}
                                    checked={client.complete}
                                    onChange={onCompleteChange}
                                    disabled={readOnly}
                                    className="h-4 w-4 cursor-pointer"
                                />
                                <label htmlFor={"complete_" + client.process_id} className="text-sm cursor-pointer">Completado</label>
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col xs={24}>
                                <label className={label}>Observaciones</label>
                                <Input
                                    id={"observations_" + client.process_id}
                                    value={client.observations || ''}
                                    onChange={onObservationsChange}
                                    disabled={readOnly}
                                    placeholder="Observaciones"
                                />
                            </Col>
                        </Row>
                    </fieldset>

                    <fieldset className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                            <legend className="text-base font-semibold">Cita</legend>
                            {!readOnly && <Button size="sm" onClick={onOpenSchedule}>Agendar cita</Button>}
                        </div>
                        {client.schedule.length > 0 ? (
                            client.schedule.map((s, i) => (
                                <div key={i} className="text-sm border border-gray-200 rounded p-2 mb-1">
                                    <div className="grid grid-cols-2 gap-1">
                                        <div><span className="text-gray-500">Oficina: </span>{s.office}</div>
                                        <div><span className="text-gray-500">Ciudad: </span>{s.city || '—'}</div>
                                        <div><span className="text-gray-500">Fecha: </span>{moment(s.appointment_date, 'YYYY-MM-DD').format('DD/MM/YYYY')}</div>
                                        <div><span className="text-gray-500">Horario: </span>{s.schedule}</div>
                                        {s.observations && (
                                            <div className="col-span-2"><span className="text-gray-500">Obs: </span>{s.observations}</div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-gray-400">Sin cita registrada</p>
                        )}
                    </fieldset>
                </Col>
            </Row>
        </div>
    );
};

export default PassportClientCard;
