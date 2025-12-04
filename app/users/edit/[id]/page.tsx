"use client";

import { useState, useEffect, use } from "react";
import Form, { SimpleItem, GroupItem, RequiredRule, ButtonItem } from "devextreme-react/form";
import Tabs from "devextreme-react/tabs";
import { useRouter } from "next/navigation";
import { lookups } from "@/data/lookups";

export default function EditUserPage(props: any) {
    const { id } = use(props.params);

    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(0);
    const [model, setModel] = useState<any | null>(null);
    const [original, setOriginal] = useState<any | null>(null);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        const load = async () => {
            const res = await fetch(`/api/users/${id}`);
            const data = await res.json();
            setModel(data);
            setOriginal(data);
        };
        load();
    }, [id]);

    const updateModel = (field: string, value: any) => {
        const updated = { ...model, [field]: value };
        setModel(updated);
        setChanged(JSON.stringify(updated) !== JSON.stringify(original));
        handleAutoPermissions(updated);
    };

    const handleAutoPermissions = (data: any) => {
        if (data.admin) {
            const updated = {
                ...data,
                tumSubeleriGorebilir: true,
                stokMaliyetleriniGorur: true,
                satisTemsilcisi: true,
                kisitliFinansKullanıcı: true,
                sistemYetkilisi: true,
            };
            setModel(updated);
            setChanged(true);
            return;
        }

        if (data.temsilci) {
            const updated = {
                ...data,
                satisTemsilcisi: true,
                tumSubeleriGorebilir: true,
            };
            setModel(updated);
            setChanged(true);
            return;
        }
    };

    const handleSave = async () => {
        if (!changed) return;
        await fetch(`/api/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(model),
        });
        router.push("/users");
    };

    if (!model) return <div className="text-white p-6">Yükleniyor...</div>;

    return (
        <div className="p-6">

            <div className="mb-4">
                <Tabs
                    dataSource={[
                        "Kullanıcı Bilgileri",
                        "Şirket Şube",
                        "Depo",
                        "Departman Yetkileri",
                    ]}
                    selectedIndex={selectedTab}
                    onSelectionChanged={(e) =>
                        setSelectedTab(e.component.option("selectedIndex"))
                    }
                />
            </div>

            <div className="bg-neutral-900 p-6 rounded-lg shadow-lg border border-neutral-700 text-white">
                {selectedTab === 0 && (
                    <Form
                        formData={model}
                        labelLocation="top"
                        onFieldDataChanged={(e) =>
                            updateModel(e.dataField, e.value)
                        }
                    >
                        <GroupItem colCount={4}>

                            <SimpleItem dataField="fullName" label={{ text: "Ad Soyad" }}>
                                <RequiredRule message="Ad soyad gerekli" />
                            </SimpleItem>

                            <SimpleItem dataField="kullaniciAdi" label={{ text: "Kullanıcı Adı" }}>
                                <RequiredRule message="Gerekli" />
                            </SimpleItem>

                            <SimpleItem
                                dataField="sifre"
                                editorType="dxTextBox"
                                label={{ text: "Şifre" }}
                                editorOptions={{ mode: "password" }}
                            />

                            <SimpleItem
                                dataField="grupTanimi"
                                editorType="dxSelectBox"
                                label={{ text: "Grup Tanımı" }}
                                editorOptions={{
                                    items: lookups.grupTanimi,
                                    searchEnabled: true
                                }}
                            />

                            <SimpleItem
                                dataField="departman"
                                editorType="dxSelectBox"
                                label={{ text: "Departman" }}
                                editorOptions={{
                                    items: lookups.departman,
                                    searchEnabled: true
                                }}
                            />

                            <SimpleItem dataField="email" label={{ text: "Email Adresi" }}>
                                <RequiredRule message="Email gerekli" />
                            </SimpleItem>

                            <SimpleItem dataField="admin" label={{ text: "Admin" }} editorType="dxCheckBox" />
                            <SimpleItem dataField="temsilci" label={{ text: "Temsilci" }} editorType="dxCheckBox" />
                            <SimpleItem dataField="tumSubeleriGorebilir" label={{ text: "Tüm Şubeleri Görebilir" }} editorType="dxCheckBox" />
                            <SimpleItem dataField="stokMaliyetleriniGorur" label={{ text: "Stok Maliyetlerini Görür" }} editorType="dxCheckBox" />
                            <SimpleItem dataField="satisTemsilcisi" label={{ text: "Satış Temsilcisi" }} editorType="dxCheckBox" />
                            <SimpleItem dataField="kisitliFinansKullanıcı" label={{ text: "Kısıtlı Finans Kullanıcısı" }} editorType="dxCheckBox" />
                            <SimpleItem dataField="sistemYetkilisi" label={{ text: "Sistem Yetkilisi" }} editorType="dxCheckBox" />

                        </GroupItem>


                        <ButtonItem
                            horizontalAlignment="right"
                            buttonOptions={{
                                text: "Kaydet",
                                type: "success",
                                disabled: !changed,
                                onClick: handleSave,
                                width: "200px"
                            }}
                        />

                    </Form>
                )}
            </div>

        </div>
    );
}
