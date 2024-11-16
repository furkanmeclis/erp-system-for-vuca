import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
export default function OrdersTable({ auth, users }) {

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Paketler</h2>}
        >
            <Head title="Paketler" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <DataTable value={users} size={"small"} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} pageLinkSize={1}>
                            <Column sortable  field="id" header="Id#"></Column>
                            <Column sortable  field="name" header="Adı"></Column>
                            <Column sortable  field="email" header="Email"></Column>
                            <Column sortable  field="created_at" header="Kayıt Tarihi"></Column>
                            <Column header={"İşlemler"} body={<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                Düzenle
                            </button>}>

                            </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
