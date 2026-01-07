import { Breadcrumb, Col } from "rsuite"
import { IUser } from "../../utils/interfaces/function";
import { useUserStore } from "../../utils/stores/useUserStore";

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
    const user:IUser = useUserStore(store => store.user);

    return (
        <Col xs={24} className="flex justify-end items-center">
            <Breadcrumb className="border px-3 py-2 rounded-lg shadow-sm my-2">
                {user.role !== 'cliente' && <Breadcrumb.Item href="/">Inicio</Breadcrumb.Item>}
                <Breadcrumb.Item href={url}>{page}</Breadcrumb.Item>
                <Breadcrumb.Item active>{subpage}</Breadcrumb.Item>
            </Breadcrumb>
        </Col>
    )
}

export default Title;