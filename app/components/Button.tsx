import React, { forwardRef } from "react"
import { Button as AriaButton } from 'ariakit/button';
import clsx from 'clsx';

type ButtonTheme = 'dark' | 'light' | 'auto' | 'auto-inverted'

interface IButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	theme?: ButtonTheme
}

const Button = forwardRef<HTMLButtonElement, IButtonProps>(({ theme = 'auto', ...props }, ref) => {
	return (
		<AriaButton
			{...props}
			ref={ref}
			className={clsx(
				'px-4 py-2',
				'transition-all duration-150 bg-none border-2 font-bold',
				props.className,
				{
					'border-codGray-900 text-codGray-900': theme === 'light',
					'border-silver-100 text-silver-100': theme === 'light',
					'dark:border-codGray-900 dark:text-codGray-900 border-codGray-100 text-codGray-100': theme === 'auto-inverted',
					'border-codGray-900 text-codGray-900 dark:border-codGray-100 dark:text-codGray-100': theme === 'auto',
				}
			)}
		/>
	)
})

Button.displayName = 'Button'

export default Button;
