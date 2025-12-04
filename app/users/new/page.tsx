"use client";

import { useState } from "react";
import Form, {
    SimpleItem,
    ButtonItem,
    RequiredRule
} from "devextreme-react/form";
import { useRouter } from "next/navigation";
import { lookups } from "@/data/lookups";

interface UserModel {
    fullName: string;
    kullaniciAdi: string;
    sifre: string;
    email?: string;
    grupTanimi: string;
    departman: string;
    admin: boolean;
    temsilci: boolean;
}

export default function NewUserPage() {
    const router = useRouter();

    const [model, setModel] = useState<UserModel>({
        fullName: "",
        kullaniciAdi: "",
        sifre: "",
        email: "",
        grupTanimi: "",
        departman: "",
        admin: false,
        temsilci: false
    });

    const handleSave = async () => {
        await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(model)
        });

        router.push("/users");
    };

    return (
        <div className="p-6 max-w-xl mx-auto">
            <h1 className="text-2xl text-white font-semibold mb-6">Yeni Kullanıcı</h1>

            <Form
                formData={model}
                labelLocation="top"
                onFieldDataChanged={(e) =>
                    setModel((prev) => ({ ...prev, [e.dataField]: e.value }))
                }
            >
                <SimpleItem dataField="fullName" label={{ text: "Ad - Soyad" }}>
                    <RequiredRule message="Ad soyad gerekli" />
                </SimpleItem>

                <SimpleItem dataField="kullaniciAdi" label={{ text: "Kullanıcı Adı" }}>
                    <RequiredRule message="Kullanıcı adı gerekli" />
                </SimpleItem>

                <SimpleItem
                    dataField="sifre"
                    label={{ text: "Şifre" }}
                    editorType="dxTextBox"
                    editorOptions={{
                        mode: "password",
                        showClearButton: true
                    }}
                >
                    <RequiredRule message="Şifre gerekli" />
                </SimpleItem>

                <SimpleItem
                    dataField="email"
                    label={{ text: "E-Mail (Opsiyonel)" }}
                    editorType="dxTextBox"
                    editorOptions={{
                        mode: "email",
                        showClearButton: true
                    }}
                />

                <SimpleItem
                    dataField="grupTanimi"
                    label={{ text: "Grup Tanımı" }}
                    editorType="dxSelectBox"
                    editorOptions={{
                        items: lookups.grupTanimi,
                        searchEnabled: true
                    }}
                >
                    <RequiredRule message="Grup seçilmesi gerekli" />
                </SimpleItem>

                <SimpleItem
                    dataField="departman"
                    label={{ text: "Departman" }}
                    editorType="dxSelectBox"
                    editorOptions={{
                        items: lookups.departman,
                        searchEnabled: true
                    }}
                >
                    <RequiredRule message="Departman seçilmesi gerekli" />
                </SimpleItem>

                <SimpleItem
                    dataField="admin"
                    label={{ text: "Admin" }}
                    editorType="dxCheckBox"
                />

                <SimpleItem
                    dataField="temsilci"
                    label={{ text: "Temsilci" }}
                    editorType="dxCheckBox"
                />

                <ButtonItem
                    horizontalAlignment="left"
                    buttonOptions={{
                        text: "Kaydet",
                        type: "success",
                        width: "100%",
                        stylingMode: "contained",
                        onClick: handleSave
                    }}
                />
            </Form>
        </div>
    );
}
