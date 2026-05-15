import { Col, Row } from 'rsuite';
import Input from '../../../common/Input';
import Button from '../../../common/Button';

export type PassportFiltersState = {
    no_applicants: string;
    client: string;
    email: string;
    status: string;
}

type Props = {
    filters: PassportFiltersState;
    onTextChange: (key: keyof PassportFiltersState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onNew: () => void;
}

const PassportFilters = ({ filters, onTextChange, onStatusChange, onNew }: Props) => {
    return (
        <Row className="mb-1">
            <Col xs={20}>
                <div className="flex gap-2">
                    <div style={{ flex: 1 }}>
                        <Input
                            id="filter_no_applicants"
                            value={filters.no_applicants}
                            onChange={onTextChange('no_applicants')}
                            placeholder="No. Solicitantes"
                        />
                    </div>
                    <div style={{ flex: 2 }}>
                        <Input
                            id="filter_client"
                            value={filters.client}
                            onChange={onTextChange('client')}
                            placeholder="Cliente"
                        />
                    </div>
                    <div style={{ flex: 2 }}>
                        <Input
                            id="filter_email"
                            value={filters.email}
                            onChange={onTextChange('email')}
                            placeholder="Correo"
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <select
                            value={filters.status}
                            onChange={onStatusChange}
                            className="py-1 px-2 block w-full border border-gray-300 outline-0 rounded-lg text-sm h-[1.85rem] bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        >
                            <option value="">Todos</option>
                            <option value="Activo">Activo</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                    </div>
                </div>
            </Col>
            <Col xs={4} className="flex justify-end">
                <Button onClick={onNew}>Nuevo</Button>
            </Col>
        </Row>
    );
};

export default PassportFilters;
