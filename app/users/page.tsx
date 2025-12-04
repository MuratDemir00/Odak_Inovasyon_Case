"use client";

import { useEffect, useState } from "react";
import DataGrid, {
    Column,
    Editing,
    Scrolling,
    Toolbar,
    Item as ToolbarItem,
    HeaderFilter,
    FilterRow
} from "devextreme-react/data-grid";
import { useRouter } from "next/navigation";

interface User {
    id: number;
    fullName: string;
    kullaniciAdi: string;
    grupTanimi: string;
    departman: string;
    admin: boolean;
    temsilci: boolean;
}

export default function UsersPage() {
    const router = useRouter();
    const [data, setData] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const res = await fetch("/api/users");

            if (!res.ok) {
                console.error("API ERROR", res.status);
                setData([]);
                return;
            }

            const users = await res.json();
            setData(users);
        } catch (err) {
            console.error("FETCH ERROR", err);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);




    const handleDelete = async (id: number) => {

        const ok = confirm("Bu kullanıcıyı silmek istediğinizden emin misiniz?");
        if (!ok) return;

        try {
            const res = await fetch(`/api/users/${id}`, { method: "DELETE" });

            if (!res.ok) {
                console.error("Silme işlemi başarısız:", res.status);
                alert("Bir hata oluştu, kullanıcı silinemedi.");
                return;
            }

            alert("Kullanıcı başarıyla silindi.");
            loadData();

        } catch (error) {
            console.error("DELETE ERROR:", error);
            alert("Sunucuya ulaşılamadı.");
        }
    };



    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-semibold">Kullanıcılar</h1>


            <DataGrid
                dataSource={data}
                keyExpr="id"
                showBorders={true}
                rowAlternationEnabled={true}
                focusedRowEnabled={true}
                height={600}
                onRowDblClick={(e) => router.push(`/users/edit/${e.data.id}`)}
                loadPanel={{ enabled: loading }}
                allowColumnResizing={true}
                allowColumnReordering={true}
                columnAutoWidth={true}
            >
                <HeaderFilter visible={true} />
                <Scrolling mode="virtual" />
                <Editing mode="row" allowDeleting={true} />

                <Column
                    dataField="fullName"
                    caption="Ad Soyad"
                    allowSorting={true}
                    allowFiltering={true}
                    width={220}
                />

                <Column
                    dataField="id"
                    caption="No"
                    width={100}
                    allowSorting={true}
                    allowFiltering={true}
                />

                <Column
                    dataField="kullaniciAdi"
                    caption="Kullanıcı Adı"
                    allowSorting={true}
                    allowFiltering={true}
                />

                <Column
                    dataField="grupTanimi"
                    caption="Grup Tanımı"
                    allowSorting={true}
                    allowFiltering={true}
                />

                <Column
                    dataField="departman"
                    caption="Departman"
                    allowSorting={true}
                    allowFiltering={true}
                />

                <Column
                    dataField="admin"
                    caption="Admin"
                    dataType="boolean"
                    width={120}
                    allowSorting={true}
                    allowFiltering={true}
                />

                <Column
                    dataField="temsilci"
                    caption="Temsilci"
                    dataType="boolean"
                    width={120}
                    allowSorting={true}
                    allowFiltering={true}
                />

                <Column
                    type="buttons"
                    width={120}
                    buttons={[
                        {
                            hint: "Düzenle",
                            icon: "edit",
                            onClick: (e) => router.push(`/users/edit/${e.row.data.id}`)
                        },
                        {
                            hint: "Sil",
                            icon: "trash",
                            onClick: (e) => handleDelete(e.row.data.id),
                        }
                    ]}
                />

                <Toolbar>
                    <ToolbarItem
                        widget="dxButton"
                        location="after"
                        options={{
                            text: "Yeni Kullanıcı",
                            type: "default",
                            stylingMode: "contained",
                            onClick: () => router.push("/users/new")
                        }}
                    />
                </Toolbar>
            </DataGrid>
        </div>
    );
}
