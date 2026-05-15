import { Col, Row } from "rsuite";
import { PassportSalesInfo } from "../../../../utils/interfaces/passportSales";

type Props = {
    info: PassportSalesInfo;
}

const PassportSaleHeader = ({ info }: Props) => {
    const label = "text-xs text-gray-500";
    const value = "text-sm font-medium text-gray-800";

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <Row>
                <Col xs={12} md={4}>
                    <p className={label}>Folio</p>
                    <p className={value}>{info.folio}</p>
                </Col>
                <Col xs={12} md={3}>
                    <p className={label}>Fecha</p>
                    <p className={value}>{info.date}</p>
                </Col>
                <Col xs={12} md={4}>
                    <p className={label}>Sucursal</p>
                    <p className={value}>{info.branch_office}</p>
                </Col>
                <Col xs={12} md={3}>
                    <p className={label}>Tipo</p>
                    <p className={value}>{info.type}</p>
                </Col>
                <Col xs={12} md={3}>
                    <p className={label}>Estatus</p>
                    <p className={value}>{info.status}</p>
                </Col>
                <Col xs={24} md={7}>
                    <p className={label}>Cliente (facturación)</p>
                    <p className={value}>{info.names} {info.lastname1}{info.lastname2 ? ' ' + info.lastname2 : ''}</p>
                    <p className="text-xs text-gray-400">{info.email} · {info.phone}</p>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col xs={12} md={4}>
                    <p className={label}>Total</p>
                    <p className={value}>${info.total}</p>
                </Col>
                <Col xs={12} md={4}>
                    <p className={label}>Abono</p>
                    <p className={value}>${info.advance_payment}</p>
                </Col>
                <Col xs={12} md={4}>
                    <p className={label}>Por pagar</p>
                    <p className={value}>${info.payable}</p>
                </Col>
                <Col xs={12} md={4}>
                    <p className={label}>Pagado</p>
                    <p className={value}>${info.payments ?? '0'}</p>
                </Col>
            </Row>
        </div>
    );
};

export default PassportSaleHeader;
