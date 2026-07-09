import clsx from 'clsx';
import { TextInputProps } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

interface InputProps extends TextInputProps {
    invalid?: boolean
}

export function Input({ invalid, ...rest }: InputProps) {
    return (
        <TextInput
            className={clsx("font-regular w-full h-12 rounded-2xl px-4 text-lg  border  dark:text-gray-300 text-gray-800 placeholder-shown:items-center", {
                "border-red-500 bg-red-50 dark:bg-red-950 ": invalid,
                "border-gray-300 dark:border-gray-600 dark:bg-[#242331] bg-gray-100 placeholder:text-gray-400": !invalid,
            })}

            {...rest}
        />
    );
}
