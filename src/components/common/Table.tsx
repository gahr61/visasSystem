import { ReactNode, useEffect, useState } from "react";
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
    height?: string | number
}

const Table = ({
    columns,
    data = [],
    height = 'auto'
}: Props)=>{
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        if(data.length === 0){
            setTimeout(()=>{
                setLoading(false)
            },1000);
        }
    },[]);


    return(
        <Row className="mt-2">
            <Col xs={24}>
                <TableContent 
                    loading={loading}
                    data={data}
                    headerHeight={30}
                    height={height === 'auto' ? 
                        document.getElementById('header-content')?.offsetHeight || 60 
                    : window.innerHeight - 200}
                    hover
                >
                    {columns.map((column, index)=>
                        <Column key={index} flexGrow={column.grow}>
                            <HeaderCell>{column.title}</HeaderCell>
                            <Cell style={{padding:8}}>{rowData => column.render(rowData)}</Cell>
                        </Column>
                    )}
                </TableContent>
            </Col>
        </Row>
    )
}

export default Table;