import { Spinner } from "@nextui-org/react";

export default function LoadingComponent({label}: {label?: string}) {
    return (
        <div className='fixed inset-0 flex justify-center items-center'>
            <Spinner label={label || 'Carregando...'} color='secondary' labelColor='secondary' />
        </div>
    )
}
