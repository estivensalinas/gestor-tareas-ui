import { useMemo } from 'react';
import zxcvbn from 'zxcvbn';

const PasswordStrengthMeter = ({ password }) => {
    const result = useMemo(() => {
        if (!password) return null;
        return zxcvbn(password);
    }, [password]);

    if (!password) return null;

    const strengthLabels = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
    const strengthColors = ['#dc2626', '#f97316', '#eab308', '#22c55e', '#16a34a'];
    const strengthWidths = ['20%', '40%', '60%', '80%', '100%'];

    const score = result?.score || 0;

    // Validaciones específicas
    const validations = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[@$!%*?&]/.test(password)
    };

    const allValid = Object.values(validations).every(v => v);

    return (
        <div className="mt-2 space-y-2">
            {/* Barra de fortaleza */}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className="h-full transition-all duration-300"
                    style={{
                        width: strengthWidths[score],
                        backgroundColor: strengthColors[score]
                    }}
                />
            </div>

            {/* Etiqueta de fortaleza */}
            <div className="flex justify-between items-center text-sm">
                <span style={{ color: strengthColors[score] }}>
                    {strengthLabels[score]}
                </span>
                {result?.crack_times_display?.offline_slow_hashing_1e4_per_second && (
                    <span className="text-gray-500 text-xs">
                        Tiempo de crackeo: {result.crack_times_display.offline_slow_hashing_1e4_per_second}
                    </span>
                )}
            </div>

            {/* Lista de requisitos */}
            <ul className="text-xs space-y-1 mt-3">
                <li className={`flex items-center gap-2 ${validations.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.minLength ? '✓' : '○'} Mínimo 8 caracteres
                </li>
                <li className={`flex items-center gap-2 ${validations.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasUppercase ? '✓' : '○'} Una letra mayúscula
                </li>
                <li className={`flex items-center gap-2 ${validations.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasLowercase ? '✓' : '○'} Una letra minúscula
                </li>
                <li className={`flex items-center gap-2 ${validations.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasNumber ? '✓' : '○'} Un número
                </li>
                <li className={`flex items-center gap-2 ${validations.hasSpecial ? 'text-green-600' : 'text-gray-500'}`}>
                    {validations.hasSpecial ? '✓' : '○'} Un carácter especial (@$!%*?&)
                </li>
            </ul>

            {/* Indicador de cumplimiento total */}
            {allValid && (
                <div className="text-green-600 text-sm font-medium flex items-center gap-2 mt-2">
                    ✓ La contraseña cumple todos los requisitos
                </div>
            )}
        </div>
    );
};

export default PasswordStrengthMeter;
