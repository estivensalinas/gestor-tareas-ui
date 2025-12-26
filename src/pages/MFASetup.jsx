import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const MFASetup = () => {
    const navigate = useNavigate();
    const { user, setupMfa, enableMfa, disableMfa } = useAuth();

    const [step, setStep] = useState(user?.twoFactorEnabled ? 'enabled' : 'initial');
    const [qrData, setQrData] = useState(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSetup = async () => {
        setLoading(true);
        try {
            const data = await setupMfa();
            setQrData(data);
            setStep('scan');
            toast.success("Escanea el código QR con tu app autenticadora");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error al configurar MFA");
        } finally {
            setLoading(false);
        }
    };

    const handleEnable = async () => {
        if (verificationCode.length !== 6) {
            toast.error("El código debe tener 6 dígitos");
            return;
        }

        setLoading(true);
        try {
            await enableMfa(verificationCode);
            setStep('enabled');
            toast.success("¡MFA habilitado exitosamente!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Código inválido");
            setVerificationCode("");
        } finally {
            setLoading(false);
        }
    };

    const handleDisable = async () => {
        if (verificationCode.length !== 6) {
            toast.error("El código debe tener 6 dígitos");
            return;
        }

        setLoading(true);
        try {
            await disableMfa(verificationCode);
            setStep('initial');
            setVerificationCode("");
            toast.success("MFA deshabilitado");
        } catch (error) {
            toast.error(error.response?.data?.message || "Código inválido");
            setVerificationCode("");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-md mx-auto">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
                >
                    ← Volver al Dashboard
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        🔐 Autenticación de Dos Factores
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Agrega una capa extra de seguridad a tu cuenta
                    </p>

                    {/* Estado: MFA ya habilitado */}
                    {step === 'enabled' && (
                        <div className="space-y-4">
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">✅</span>
                                    <div>
                                        <h3 className="font-semibold text-green-800">MFA Activo</h3>
                                        <p className="text-sm text-green-600">
                                            Tu cuenta está protegida con autenticación de dos factores
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="font-medium text-gray-700 mb-3">
                                    Deshabilitar MFA
                                </h3>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Código de 6 dígitos"
                                    className="w-full p-3 border rounded-lg text-center text-xl tracking-widest font-mono mb-3"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                />
                                <button
                                    onClick={handleDisable}
                                    disabled={loading || verificationCode.length !== 6}
                                    className="w-full py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50"
                                >
                                    {loading ? "Verificando..." : "Deshabilitar MFA"}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Estado: Inicial - No configurado */}
                    {step === 'initial' && (
                        <div className="space-y-4">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">⚠️</span>
                                    <div>
                                        <h3 className="font-semibold text-yellow-800">MFA No Configurado</h3>
                                        <p className="text-sm text-yellow-600">
                                            Recomendamos habilitar MFA para mayor seguridad
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSetup}
                                disabled={loading}
                                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 font-semibold"
                            >
                                {loading ? "Configurando..." : "Configurar MFA"}
                            </button>

                            <div className="text-sm text-gray-500">
                                <h4 className="font-medium mb-2">Necesitarás:</h4>
                                <ul className="space-y-1">
                                    <li>• Un smartphone con una app autenticadora instalada</li>
                                    <li>• Google Authenticator, Authy, o similar</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Estado: Escanear QR */}
                    {step === 'scan' && qrData && (
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                                <p className="text-blue-800 mb-4">
                                    Escanea este código QR con tu app autenticadora:
                                </p>
                                <div className="flex justify-center mb-4">
                                    <img
                                        src={qrData.qrCode}
                                        alt="QR Code"
                                        className="w-48 h-48 rounded-lg border-4 border-white shadow-lg"
                                    />
                                </div>
                                <details className="text-left">
                                    <summary className="text-sm text-blue-600 cursor-pointer">
                                        ¿No puedes escanear? Ingresa el código manualmente
                                    </summary>
                                    <code className="block mt-2 p-2 bg-white rounded text-xs break-all">
                                        {qrData.secret}
                                    </code>
                                </details>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Ingresa el código de 6 dígitos de tu app:
                                </label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="000000"
                                    className="w-full p-3 border rounded-lg text-center text-2xl tracking-widest font-mono"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                                    autoFocus
                                />
                            </div>

                            <button
                                onClick={handleEnable}
                                disabled={loading || verificationCode.length !== 6}
                                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold"
                            >
                                {loading ? "Verificando..." : "Verificar y Activar MFA"}
                            </button>

                            <button
                                onClick={() => {
                                    setStep('initial');
                                    setQrData(null);
                                    setVerificationCode("");
                                }}
                                className="w-full py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MFASetup;
