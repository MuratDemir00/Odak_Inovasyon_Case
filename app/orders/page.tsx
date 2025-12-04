"use client";

import { useEffect, useState } from "react";
import DataGrid, {
    Column,
    Editing,
    Scrolling,
    Paging,
    Toolbar,
    Item
} from "devextreme-react/data-grid";
import DateBox from "devextreme-react/date-box";
import SelectBox from "devextreme-react/select-box";
import Popup from "devextreme-react/popup";
import TextBox from "devextreme-react/text-box";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [selectedUser, setSelectedUser] = useState<any>(null);

    const [photoModal, setPhotoModal] = useState(false);
    const [photoUrl, setPhotoUrl] = useState("");

    const [newOrderModal, setNewOrderModal] = useState(false);

    const [newOrder, setNewOrder] = useState<any>({
        sube: "",
        seri: "",
        siparisNo: "",
        firmaAdi: "",
        teslimSekli: "",
        temsilciId: null,
        tarih: new Date().toISOString().slice(0, 10)
    });

    const loadOrders = async () => {
        const res = await fetch(
            `/api/orders?start=${startDate}&end=${endDate}&user=${selectedUser ?? ""}`
        );
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

    const handleDeleteProduct = async (itemId: number) => {
        if (!selectedOrderId) return;

        const ok = confirm("Bu ürünü silmek istiyor musunuz?");
        if (!ok) return;

        try {
            const res = await fetch(`/api/orders/${selectedOrderId}/items/${itemId}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                alert("Silme başarısız.");
                return;
            }

            loadProducts(selectedOrderId);
            alert("Silindi.");

        } catch {
            alert("Sunucuya ulaşılamadı.");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        loadOrders();
    }, [startDate, endDate, selectedUser]);

    const onOrderSelected = (e: any) => {
        const id = e.data?.id;
        setSelectedOrderId(id);
        loadProducts(id);
    };

    const handlePhotoClick = (url: string) => {
        setPhotoUrl(url);
        setPhotoModal(true);
    };

    const handleSaveNewOrder = async () => {
        await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newOrder)
        });

        setNewOrderModal(false);
        loadOrders();
    };

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-semibold mb-4">Siparişler</h1>

            <DataGrid
                dataSource={orders}
                keyExpr="id"
                showBorders
                focusedRowEnabled
                height={330}
                onRowClick={onOrderSelected}
                onRowUpdating={async (e) => {
                    const updated = { ...e.oldData, ...e.newData };

                    await fetch(`/api/orders/${updated.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updated)
                    });

                    loadOrders();
                }}
                onRowRemoving={async (e) => {
                    await fetch(`/api/orders/${e.data.id}`, {
                        method: "DELETE"
                    });

                    loadOrders();
                }}
            >
                <Toolbar>
                    <Item location="before">
                        <span>Başlangıç:</span>
                    </Item>
                    <Item location="before">
                        <DateBox value={startDate} onValueChanged={(e) => setStartDate(e.value)} type="date" />
                    </Item>

                    <Item location="before">
                        <span>Bitiş:</span>
                    </Item>
                    <Item location="before">
                        <DateBox value={endDate} onValueChanged={(e) => setEndDate(e.value)} type="date" />
                    </Item>

                    <Item location="before">
                        <span>Kullanıcı:</span>
                    </Item>
                    <Item location="before">
                        <SelectBox
                            items={users}
                            valueExpr="id"
                            displayExpr="kullaniciAdi"
                            value={selectedUser}
                            onValueChanged={(e) => setSelectedUser(e.value)}
                            searchEnabled
                            width={180}
                        />
                    </Item>

                    <Item location="after">
                        <button
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                            onClick={() => setNewOrderModal(true)}
                        >
                            + Yeni Sipariş
                        </button>
                    </Item>
                </Toolbar>

                <Scrolling mode="virtual" />
                <Paging enabled={false} />

                <Editing mode="row" allowUpdating />
                <Column dataField="id" caption="No" width={80} />
                <Column dataField="sube" caption="Şube" />
                <Column dataField="seri" caption="Seri" width={90} />
                <Column dataField="siparisNo" caption="Sipariş No" width={120} />
                <Column dataField="tarih" caption="Sipariş Tarihi" dataType="date" width={150} />
                <Column dataField="firmaAdi" caption="Firma Adı" width={200} />
                <Column dataField="teslimSekli" caption="Teslim Şekli" width={120} />
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

                <Column
                    type="buttons"
                    width={120}
                    buttons={[
                        // {
                        //     hint: "Düzenle",
                        //     icon: "edit",
                        //     onClick: (e) => {
                        //         e.component.editRow(e.rowIndex);
                        //     }
                        // },
                        {
                            hint: "Sil",
                            icon: "trash",
                            onClick: async (e) => {
                                const ok = confirm("Bu siparişi silmek istiyor musunuz?");
                                if (!ok) return;

                                await fetch(`/api/orders/${e.row.data.id}`, {
                                    method: "DELETE"
                                });

                                loadOrders();
                            }
                        },

                    ]}
                />


            </DataGrid>

            <Popup
                visible={newOrderModal}
                onHiding={() => setNewOrderModal(false)}
                title="Yeni Sipariş"
                width={500}
                height={600}
            >
                <div className="flex flex-col gap-3 p-4 text-black">

                    <DateBox
                        type="date"
                        value={newOrder.tarih}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, siparisTarihi: e.value }))
                        }
                    />

                    <TextBox
                        placeholder="Şube"
                        value={newOrder.sube}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, sube: e.value }))
                        }
                    />

                    <TextBox
                        placeholder="Seri"
                        value={newOrder.seri}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, seri: e.value }))
                        }
                    />

                    <TextBox
                        placeholder="Sipariş No"
                        value={newOrder.siparisNo}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, siparisNo: e.value }))
                        }
                    />

                    <TextBox
                        placeholder="Firma Adı"
                        value={newOrder.firmaAdi}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, firmaAdi: e.value }))
                        }
                    />

                    <TextBox
                        placeholder="Teslim Şekli"
                        value={newOrder.teslimSekli}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, teslimSekli: e.value }))
                        }
                    />

                    <SelectBox
                        items={users}
                        valueExpr="id"
                        displayExpr="kullaniciAdi"
                        placeholder="Temsilci"
                        value={newOrder.temsilciId}
                        onValueChanged={(e) =>
                            setNewOrder((prev: any) => ({ ...prev, temsilciId: e.value }))
                        }
                    />

                    <button
                        className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full p-2 rounded"
                        onClick={handleSaveNewOrder}
                    >
                        Kaydet
                    </button>
                </div>
            </Popup>

            {selectedOrderId && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-2">Ürünler</h2>

                    <DataGrid
                        dataSource={products}
                        keyExpr="id"
                        showBorders
                        rowAlternationEnabled
                        height={350}
                        onRowUpdating={async (e) => {
                            const updated = { ...e.oldData, ...e.newData };

                            await fetch(`/api/orders/${selectedOrderId}/items/${updated.id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(updated)
                            });

                            loadProducts(selectedOrderId);
                        }}
                        onRowInserting={async (e) => {
                            await fetch(`/api/orders/${selectedOrderId}/items`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(e.data)
                            });

                            loadProducts(selectedOrderId);
                        }}
                    >
                        <Scrolling mode="virtual" />

                        <Editing
                            mode="row"
                            allowUpdating={true}
                            allowAdding={true}
                            allowDeleting={false}
                            useIcons={true}
                        />

                        <Column dataField="urunNo" caption="Ürün No" width={120} />
                        <Column dataField="sira" caption="Sıra No" width={90} />
                        <Column dataField="urunAdi" caption="Ürün Adı" width={250} />
                        <Column dataField="profil" caption="Profil" width={120} />
                        <Column dataField="renk" caption="Renk" width={120} />
                        <Column dataField="adet" caption="Adet" dataType="number" width={80} />
                        <Column dataField="miktar" caption="Miktar" dataType="number" width={100} />
                        <Column dataField="foto" caption="Fotoğraf Yolu" width={220} />


                        <Column
                            type="buttons"
                            width={180}
                            buttons={[
                                // "edit",
                                // {
                                //     hint: "Fotoğraf",
                                //     icon: "image",
                                //     onClick: (e) => handlePhotoClick(e.row.data.foto),
                                //     visible: (e) => !!e.row.data.foto
                                // },

                                {
                                    hint: "Fotoğraf",
                                    icon: "image",          // DevExtreme'in hazır iconu
                                    visible: (e) => !!e.row.data.foto,
                                    onClick: (e) => handlePhotoClick(e.row.data.foto),
                                },
                                {
                                    hint: "Sil",
                                    icon: "trash",
                                    onClick: (e) => handleDeleteProduct(e.row.data.id)
                                },
                            ]}
                        />
                    </DataGrid>

                </div>
            )}

            <Popup
                visible={photoModal}
                onHiding={() => setPhotoModal(false)}
                dragEnabled
                closeOnOutsideClick
                width={450}
                height={450}
                title="Ürün Fotoğrafı"
            >
                {photoUrl ? (
                    <img src={photoUrl} className="w-full h-full object-contain" />
                ) : (
                    <div className="text-center text-gray-400 pt-20">Fotoğraf bulunamadı</div>
                )}
            </Popup>

        </div>
    );
}
