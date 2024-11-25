import { Breadcrumb, Col } from "rsuite"

interface Props {
    url: string;
    page: string;
    subpage: string;
}

const Title = ({
    url,
    page,
    subpage
}:Props)=>{
    return (
        <Col xs={24} className="flex justify-end items-center">
            <Breadcrumb className="border px-3 py-2 rounded-lg shadow-sm my-2">
                <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>
                <Breadcrumb.Item href={url}>{page}</Breadcrumb.Item>
                <Breadcrumb.Item active>{subpage}</Breadcrumb.Item>
            </Breadcrumb>
        </Col>
    )
}

export default Title;