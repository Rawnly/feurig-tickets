import type { PropsWithChildren } from "react";
import React, { forwardRef } from "react";
import {
	Select as BaseSelect, SelectArrow, SelectPopover, useSelectState,
	SelectItem as BaseSelectItem
} from 'ariakit/select'
import clsx from 'clsx';

interface ISelectProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	name?: string
	value?: string
	setValue?(value: string): void
	defaultValue?: string
	onClose?(): void
	required?: boolean
}

const Select = forwardRef<HTMLButtonElement, ISelectProps>(({
	children,
	value, setValue,
	defaultValue, onClose,
	...props
}, ref) => {
	const select = useSelectState({
		value,
		setValue,
		defaultValue,
		sameWidth: true,
		setVisible(visible) {
			if (!visible && onClose ) {
				onClose?.()
			}
		}
	})

	return (
		<>
			<BaseSelect state={select} ref={ref} {...props} className={clsx(
				'flex justify-between items-center',
				'gap-1 whitespace-nowrap rounded-lg px-4 w-full',
				'dark:bg-silver-100 dark:hover:bg-silver-200 dark:text-codGray-900 text-silver-100 bg-codGray-900 hover:bg-codGray-800',
				'disabled:opacity-50',
				'px-4 py-2',
				{
					'rounded-b-none': select.visible
				}
			)}>
				{select.value || 'Select a value'}
				<SelectArrow className='ml-5'/>
			</BaseSelect>
			<SelectPopover state={select} modal className={clsx(
				'z-50 flex flex-col overflow-auto rounded-lg p-2 rounded-t-none',
				'dark:bg-silver-100 dark:text-codGray-900 text-silver-100 bg-codGray-900',
			)}>
				{children}
			</SelectPopover>
		</>
	);
})

Select.displayName = 'Select'

export default Select;

interface ISelectItemProps {
	value?: string
}

export const SelectItem = forwardRef<HTMLDivElement, PropsWithChildren<ISelectItemProps>>((props, ref) => (
	<BaseSelectItem ref={ref} {...props} className={clsx(
		'px-4 py-2',
		'hover:bg-codGray-800 rounded-lg cursor-pointer'
	)} />
))

SelectItem.displayName = 'Select.Item'
