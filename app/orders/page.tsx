"use client";

import { useEffect, useState } from "react";
import DataGrid, {
    Column,
    Editing,
    Scrolling,
    Paging
} from "devextreme-react/data-grid";
import DateBox from "devextreme-react/date-box";
import SelectBox from "devextreme-react/select-box";
import Popup from "devextreme-react/popup";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const [startDate, setStartDate] = useState<any>(new Date());
    const [endDate, setEndDate] = useState<any>(new Date());
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [photoModal, setPhotoModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");

    const loadOrders = async () => {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
    };

    const loadUsers = async () => {
        const res = await fetch("/api/users");
        const data = await res.json();
        setUsers(data);
    };

    const loadProducts = async (orderId: number) => {
        const res = await fetch(`/api/orders/${orderId}/items`);
        const data = await res.json();
        setProducts(data);
    };

    useEffect(() => {
        loadOrders();
        loadUsers();
    }, []);

    const onOrderSelected = (e: any) => {
        const id = e.data?.id;
        setSelectedOrderId(id);
        loadProducts(id);
    };

    const handlePhotoClick = (url: string) => {
        setPhotoUrl(url);
        setPhotoModal(true);
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-semibold mb-4">Siparişler</h1>

            <div className="flex gap-4 mb-4 bg-neutral-800 p-4 rounded-lg">
                <div>
                    <label className="text-sm">Başlangıç</label>
                    <DateBox value={startDate} onValueChanged={e => setStartDate(e.value)} type="date" />
                </div>

                <div>
                    <label className="text-sm">Bitiş</label>
                    <DateBox value={endDate} onValueChanged={e => setEndDate(e.value)} type="date" />
                </div>

                <div>
                    <label className="text-sm">Kullanıcı</label>
                    <SelectBox
                        items={users}
                        valueExpr="id"
                        displayExpr="kullaniciAdi"
                        value={selectedUser}
                        onValueChanged={(e) => setSelectedUser(e.value)}
                        searchEnabled={true}
                        width={200}
                    />
                </div>
            </div>
            <DataGrid
                dataSource={orders}
                keyExpr="id"
                showBorders
                focusedRowEnabled
                height={300}
                onSelectionChanged={onOrderSelected}
                onRowUpdating={async (e) => {
                    const updated = { ...e.oldData, ...e.newData };

                    await fetch(`/api/orders/${updated.id}`, {
                        method: "PUT",
                        body: JSON.stringify(updated)
                    });
                    loadOrders();
                }}
            >
                <Scrolling mode="virtual" />
                <Paging enabled={false} />

                <Editing mode="row" allowUpdating allowAdding allowDeleting />

                <Column dataField="id" caption="No" width={90} />
                <Column dataField="sube" caption="Şube" />
                <Column dataField="seri" caption="Seri" />
                <Column dataField="siparisNo" caption="Sipariş No" />
                <Column dataField="firmaAdi" caption="Firma Adı" />
                <Column dataField="teslimSekli" caption="Teslim Şekli" />

                <Column
                    dataField="temsilciId"
                    caption="Temsilci"
                    width={150}
                    lookup={{
                        dataSource: users,
                        valueExpr: "id",
                        displayExpr: "kullaniciAdi"
                    }}
                />
            </DataGrid>


            {selectedOrderId && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Ürünler</h2>

                    <DataGrid
                        dataSource={products}
                        keyExpr="id"
                        showBorders
                        rowAlternationEnabled
                        height={350}
                    >
                        <Scrolling mode="virtual" />

                        <Editing mode="row" allowUpdating allowAdding allowDeleting />

                        <Column dataField="urunNo" caption="Ürün No" width={120} />
                        <Column dataField="sira" caption="Sıra No" width={90} />
                        <Column dataField="urunAdi" caption="Ürün Adı" width={250} />
                        <Column dataField="profil" caption="Profil" width={120} />
                        <Column dataField="renk" caption="Renk" width={120} />
                        <Column dataField="adet" caption="Adet" dataType="number" width={100} />
                        <Column dataField="miktar" caption="Miktar" width={120} dataType="number" />

                        <Column
                            caption="Foto"
                            width={100}
                            cellRender={(e) => (
                                <button
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                                    onClick={() => handlePhotoClick(e.data.foto)}
                                >
                                    📷 Gör
                                </button>
                            )}
                        />
                    </DataGrid>
                </div>
            )}
            {/* 
            <Popup
                visible={photoModal}
                onHiding={() => setPhotoModal(false)}
                dragEnabled
                closeOnOutsideClick
                width={400}
                height={400}
                title="Ürün Fotoğrafı"
            >
                <img src={photoUrl} className="w-full h-full object-contain" />
            </Popup> */}
        </div>
    );
}
