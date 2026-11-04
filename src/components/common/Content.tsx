import { ReactElement } from "react";
import { Col, Grid, Row } from "rsuite";
import Title from "./Title";

interface Props {
    children: ReactElement;
    url:string;
    page: string;
    subpage: string;
    autoHeight?: boolean,
    /** Caja de altura fija como flex column, para que una tabla con fillParent ocupe el sobrante */
    fillHeight?: boolean,
    title?: string
}
const Content = ({
    children,
    url,
    page,
    subpage,
    autoHeight = false,
    fillHeight = false,
    title = ''
}: Props)=>{
    const height = document.getElementById('header-content')?.offsetHeight || 60;
    return(
        <Grid fluid className="pt-2">
            <Row className="flex items-center">
                <Col xs={12} className="px-4">
                    <h1 className="text-lg font-semibold">{title}</h1>
                </Col>
                <Col xs={12} className="flex items-center">
                    <Title page={page} subpage={subpage} url={url} />
                </Col>
            </Row>
            
            
            <Col
                xs={24} 
                className=" border shadow-md rounded-lg px-4 py-6"
                style={{
                    height: autoHeight ? 'auto' : 'calc(100vh - '+(height + 70)+'px)',
                    ...(fillHeight && !autoHeight ? { display: 'flex', flexDirection: 'column', minHeight: 0 } : {})
                }}
            >
                {children}
            </Col>
        </Grid>
    )
}

export default Content;