import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Pagination, Row } from 'rsuite';
import { FaInfo } from 'react-icons/fa6';
import { FaTrashAlt } from 'react-icons/fa';

import Content from '../../../components/common/Content';
import ButtonTable from '../../../components/common/ButtonTable';
import Table from '../../../components/common/Table';
import PassportFilters, { PassportFiltersState } from '../../../components/ui/procedures/passport/PassportFilters';

import { Column } from '../../../utils/interfaces/system';
import { IApp } from '../../../utils/interfaces/function';
import { PassportProcedure, PassportListParams } from '../../../utils/interfaces/passportSales';
import { passportSalesList, passportSalesDelete } from '../../../utils/services/sales/passport';
import { swalConfirm } from '../../../utils/functions';

const PassportList = ({ loader }: IApp) => {
    const navigate = useNavigate();
    const height = (window.innerHeight - 260) - (document.getElementById('header-content')?.offsetHeight || 60);

    const columns: Column[] = [
        { key: 'folio',      title: 'Folio',           grow: 1, render: (row: PassportProcedure) => row.folio },
        { key: 'date',       title: 'Fecha',           grow: 1, render: (row: PassportProcedure) => row.date },
        { key: 'type',       title: 'Tipo',            grow: 1, render: (row: PassportProcedure) => row.type },
        { key: 'applicants', title: 'No. Solicitantes',grow: 1, render: (row: PassportProcedure) => row.no_applicants.toString() },
        { key: 'client',     title: 'Cliente',         grow: 2, render: (row: PassportProcedure) => row.client },
        { key: 'email',      title: 'Correo',          grow: 2, render: (row: PassportProcedure) => row.email || '—' },
        { key: 'status',     title: 'Estatus',         grow: 1, render: (row: PassportProcedure) => row.status },
        {
            key: 'actions', title: 'Acciones', grow: 1,
            render: (row: PassportProcedure) => (
                <div className="flex gap-2">
                    <ButtonTable
                        title="Detalles"
                        controlId="details"
                        icon={<FaInfo />}
                        onClick={() => navigate('/procedures/passport/' + row.id + '/details')}
                    />
                    <ButtonTable
                        title="Eliminar"
                        controlId="delete"
                        icon={<FaTrashAlt />}
                        onClick={() => onDelete(row.id)}
                    />
                </div>
            )
        },
    ];

    const [data, setData]       = useState<PassportProcedure[]>([]);
    const [filters, setFilters] = useState<PassportFiltersState>({ no_applicants: '', client: '', email: '', status: '' });
    const [page, setPage]       = useState(1);
    const [perPage, setPerPage] = useState(25);
    const [total, setTotal]     = useState(0);
    const debounceRef           = useRef<ReturnType<typeof setTimeout> | null>(null);

    const getList = async (f: PassportFiltersState, p: number, pp: number) => {
        loader.current?.handleShow('Cargando...');
        const params: PassportListParams = { ...f, page: p, per_page: pp };
        const response = await passportSalesList(params);
        loader.current?.handleClose();
        if (response?.success) {
            setData(response.data);
            setTotal(response.meta.total);
        }
    };

    const onTextChange = (key: keyof PassportFiltersState) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value;
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setPage(1);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => getList(newFilters, 1, perPage), 400);
    };

    const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newFilters = { ...filters, status: e.target.value };
        setFilters(newFilters);
        setPage(1);
        getList(newFilters, 1, perPage);
    };

    const onDelete = (id: number) => {
        swalConfirm({
            title: 'Eliminar registro',
            text: '¿Estás seguro de eliminar este registro de pasaporte? Esta acción no se puede deshacer.',
            confirmText: 'Sí, eliminar',
            value: id,
            confirmFunction: async (value: number) => {
                loader.current?.handleShow('Eliminando...');
                const response = await passportSalesDelete(value);
                loader.current?.handleClose();
                if (response?.success) {
                    getList(filters, page, perPage);
                }
            }
        });
    };

    useEffect(() => {
        getList(filters, 1, 25);
    }, []);

    return (
        <Content
            url="/procedures/passport/list"
            page="Pasaporte"
            subpage="Listado"
            title="Pasaporte - Listado"
        >
            <>
                <PassportFilters
                    filters={filters}
                    onTextChange={onTextChange}
                    onStatusChange={onStatusChange}
                    onNew={() => navigate('/procedures/passport/new')}
                />

                <Table
                    columns={columns}
                    data={data}
                    height={height}
                />

                <Row className="mt-2">
                    <Col xs={24} className="flex justify-end">
                        <Pagination
                            total={total}
                            limit={perPage}
                            limitOptions={[10, 25, 50, 100]}
                            activePage={page}
                            onChangePage={(p) => { setPage(p); getList(filters, p, perPage); }}
                            onChangeLimit={(pp) => { setPerPage(pp); setPage(1); getList(filters, 1, pp); }}
                            layout={['total', '-', 'pager', '|', 'limit']}
                        />
                    </Col>
                </Row>
            </>
        </Content>
    );
};

export default PassportList;
