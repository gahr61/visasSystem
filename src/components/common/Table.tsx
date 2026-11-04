import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Col, Row, Table as TableContent } from "rsuite"
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";

export interface Columns {
    title: string;
    key: string;
    grow: number;
    render:(row:any)=>ReactNode
}

type Props ={
    columns: Columns[],
    data: any[],
    height?: number,
    autoHeight?: boolean,
    /**
     * Ocupa el espacio sobrante del contenedor padre (que debe ser flex column
     * con altura fija, ver Content `fillHeight`). Se recalcula al cambiar el tamaño.
     */
    fillParent?: boolean
}

const Table = ({
    columns,
    data = [],
    height = 300,
    autoHeight = false,
    fillParent = false
}: Props)=>{
    const [loading, setLoading] = useState(true);
    const wrapRef = useRef<HTMLDivElement>(null);
    const [measuredHeight, setMeasuredHeight] = useState(0);

    useEffect(()=>{
        //if(data.length === 0){
            setTimeout(()=>{
                setLoading(false)
            },1000);
        //}
    },[]);

    useLayoutEffect(()=>{
        const el = wrapRef.current;
        if(!fillParent || !el) return;

        const update = ()=> setMeasuredHeight(el.clientHeight);
        update();

        const observer = new ResizeObserver(update);
        observer.observe(el);
        return ()=> observer.disconnect();
    },[fillParent]);

    const tableHeight = fillParent ? Math.max(measuredHeight, 200) : (height || 200);

    const table = (
        <TableContent
            loading={loading}
            data={data}
            autoHeight={data.length === 0 || autoHeight}
            headerHeight={30}
            height={tableHeight}
            hover
            className="border rounded-lg"
            renderEmpty={()=><div className="flex justify-center items-center h-full"><span className="text-gray-500">No se encontraron resultados</span></div>}
        >
            {columns.map((column, index)=>
                <Column key={index} flexGrow={column.grow}>
                    <HeaderCell>{column.title}</HeaderCell>
                    <Cell style={{padding:8}}>{rowData => column.render(rowData)}</Cell>
                </Column>
            )}
        </TableContent>
    );

    if(fillParent){
        return(
            <div ref={wrapRef} className="mt-2 flex-1 min-h-0 overflow-hidden">
                {table}
            </div>
        )
    }

    return(
        <Row className="mt-2">
            <Col xs={24}>
                {table}
            </Col>
        </Row>
    )
}

export default Table;