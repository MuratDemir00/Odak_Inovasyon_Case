"use client";

import { useState } from "react";
import Form, {
    SimpleItem,
    ButtonItem,
    RequiredRule,
    StringLengthRule,
} from "devextreme-react/form";
import { useRouter } from "next/navigation";

interface LoginModel {
    kullaniciAdi: string;
    password: string;
}

export default function LoginPage() {
    const router = useRouter();
    const [model, setModel] = useState<LoginModel>({
        kullaniciAdi: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);
        setError("");

        const res = await fetch("/api/login", {
            method: "POST",
            body: JSON.stringify(model),
        });

        if (res.ok) {
            router.refresh();
            router.push("/users");
        } else {
            const data = await res.json();
            setError(data.message || "Giriş başarısız.");
            setLoading(false);
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center bg-neutral-900">
            <div className="bg-neutral-800 p-8 rounded-xl shadow-xl w-full max-w-md border border-neutral-700">

                <h1 className="text-2xl text-white font-semibold text-center mb-6">
                    Giriş Yap
                </h1>

                {error && (
                    <div className="text-red-400 text-center mb-4 font-medium">
                        {error}
                    </div>
                )}

                <Form
                    formData={model}
                    labelLocation="top"
                    onFieldDataChanged={(e) =>
                        setModel((prev) => ({ ...prev, [e.dataField]: e.value }))
                    }
                >
                    <SimpleItem
                        dataField="kullaniciAdi"
                        editorType="dxTextBox"
                        label={{ text: "Kullanıcı Adı" }}
                        editorOptions={{
                            onEnterKey: handleSubmit,
                        }}
                    >
                        <RequiredRule message="Kullanıcı adı gerekli" />
                        <StringLengthRule min={3} message="Kullanıcı adı çok kısa" />
                    </SimpleItem>

                    <SimpleItem
                        dataField="password"
                        editorType="dxTextBox"
                        label={{ text: "Şifre" }}
                        editorOptions={{
                            mode: "password",
                            onEnterKey: handleSubmit,
                        }}
                    >
                        <RequiredRule message="Şifre gerekli" />
                        <StringLengthRule min={3} message="Şifre çok kısa" />
                    </SimpleItem>

                    <ButtonItem
                        horizontalAlignment="center"
                        buttonOptions={{
                            text: loading ? "Giriş Yapılıyor..." : "Giriş Yap",
                            type: "default",
                            width: "100%",
                            stylingMode: "contained",
                            disabled: loading,
                            onClick: handleSubmit,
                        }}
                    />
                </Form>
            </div>
        </div>
    );
}
