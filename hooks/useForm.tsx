import { useState, useMemo, useCallback } from "react";
//TODO: add update select options function (for conditional filtering)

//TODO: extract to npm module?

export function useForm(formFields, initialValues = null) {
	const init = (arr) =>
		arr.reduce(
			(acc, cur) => {
				let formValid = acc.formValid;
				if (formValid && !cur.optional) {
					formValid =
						initialValues && initialValues[cur.name]
							? cur.validate(initialValues[cur.name], formattedValues)
							: cur.value && cur.validate
							? cur.validate(cur.value)
							: false;
				}

				return {
					...acc,
					formValid,
					[cur.name]: {
						value:
							initialValues && initialValues[cur.name] !== undefined
								? cur.type === "select" && initialValues[cur.name]?.value
									? initialValues[cur.name]?.value
									: initialValues[cur.name]
								: cur.value !== undefined
								? cur.value
								: null,
						valid:
							initialValues && initialValues[cur.name]
								? cur.validate(initialValues[cur.name])
								: cur.value && cur.validate
								? cur.validate(cur.value)
								: false,
						touched:
							cur.touched !== undefined
								? cur.touched
								: cur.value
								? true
								: false,
						blur: false,
						readOnly: !!cur.readOnly,
						type: cur.type,
						optional: cur.optional,
						error: cur.error,
						validate: cur.validate,
						hint: cur.hint,
						...(cur.type === "select" &&
						initialValues &&
						initialValues[cur.name]?.selectedOption
							? { selectedOption: initialValues[cur.name]?.selectedOption }
							: {}),
					},
				};
			},
			{ formValid: true }
		);

	const [values, setValues] = useState(init(formFields));
	const formattedValues: any = useMemo(() => {
		return Object.keys(values)
			.filter((key) => values[key]?.value !== undefined)
			.reduce(
				(obj, key) => ({
					...obj,
					[key]:
						key === "email"
							? values[key].value?.toLowerCase()
							: values[key].value,
				}),
				{}
			);
	}, [values]);
	const formValid = useMemo(() => {
		const fields = Object.keys(values)
			.filter((field) => !values[field]?.optional)
			.filter((field) => field !== "formValid");

		return fields.length > 0
			? fields.every((field) => values[field].valid === true)
			: true;
	}, [values]);

	const setAllTouched = () => {
		Object.keys(values).forEach((key) => {
			if (key !== "formValid") {
				const valid = validateField(key, values[key]);
				updateValue(key, { touched: true, blur: true }, valid);
			}
		});
	};

	const updateValue = useCallback(
		(name, value, valid) => {
			setValues((v) => ({
				...v,
				[name]: {
					...values[name],
					originalError: null,
					error: values[name].originalError
						? values[name].originalError
						: values[name].error,
					...value,
				},
				formValid: valid,
			}));
		},
		[values]
	);

	const validateField = useCallback(
		(name, value) => {
			return values[name].validate
				? values[name].validate(value, formattedValues)
				: true;
		},
		[formattedValues, values]
	);

	const checkValidFormForFeild = useCallback(
		(name, valid) => {
			return formFields
				.filter(({ optional }) => !optional)
				.every((field) =>
					field.name === name ? valid : values[field.name].valid
				);
		},
		[formFields, values]
	);

	const handleChange = useCallback(
		(e) => {
			if (e.persist) {
				e.persist();
			}
			const valid = validateField(e.target.name, e.target.value);
			const formValid = checkValidFormForFeild(e.target.name, valid);

			const updatedValue = { value: e.target.value, touched: true, valid };

			updateValue(e.target.name, updatedValue, formValid);
		},
		[checkValidFormForFeild, updateValue, validateField]
	);

	const handleCheckboxChange = useCallback(
		(e) => {
			if (e.persist) {
				e.persist();
			}
			const valid = validateField(e.target.name, e.target.checked);
			const formValid = checkValidFormForFeild(e.target.name, valid);

			const updatedValue = { value: e.target.checked, touched: true, valid };

			updateValue(e.target.name, updatedValue, formValid);
		},
		[checkValidFormForFeild, updateValue, validateField]
	);

	const handleSelectChange = useCallback(
		(option, action) => {
			const valid = validateField(action.name, option?.value);
			const formValid = checkValidFormForFeild(action.name, valid);
			const updatedValue = {
				value: option?.value,
				touched: true,
				valid,
				selectedOption: option,
			};
			updateValue(action.name, updatedValue, formValid);
		},
		[checkValidFormForFeild, updateValue, validateField]
	);
	const handleDateChange = useCallback(
		({ date, name }) => {
			const valid = validateField(name, date);
			const formValid = checkValidFormForFeild(name, valid);
			const updatedValue = {
				value: date,
				touched: true,
				valid,
			};
			updateValue(name, updatedValue, formValid);
		},
		[checkValidFormForFeild, updateValue, validateField]
	);

	const handleLocationChange = useCallback(
		(value, name) => {
			const valid = validateField(name, value);
			const formValid = checkValidFormForFeild(name, valid);
			const updatedValue = {
				value,
				touched: true,
				valid,
			};
			updateValue(name, updatedValue, formValid);
		},
		[checkValidFormForFeild, updateValue, validateField]
	);
	const handleMultiSelectChange = useCallback(
		(options, action) => {
			const valid = validateField(action.name, options);
			const formValid = checkValidFormForFeild(action.name, valid);
			const updatedValue = {
				value: options,
				touched: true,
				valid,
				selectedOptions: options,
			};
			updateValue(action.name, updatedValue, formValid);
		},
		[checkValidFormForFeild, updateValue, validateField]
	);

	const handleBlur = (name) => {
		if (name) {
			setValues((v) => ({ ...v, [name]: { ...v[name], blur: true } }));
		}
	};

	const reset = () => setValues(init(formFields));

	const showError = (name) => {
		if (values[name].touched && !values[name].valid) {
			return true;
		}
		return false;
	};

	const showErrorIfInvalid = (name) => {
		if (values[name].touched && !values[name].valid && values[name].blur) {
			return values[name].error;
		}
		return false;
	};

	const fieldValid = useCallback((name) => values[name].valid, [values]);
	const fieldTouched = (name) => values[name].touched;

	const valueOf = (name) => values[name].value;
	const setFieldTouched = useCallback(
		(name) => {
			updateValue(name, { touched: true, blur: false }, fieldValid(name));
		},
		[updateValue, fieldValid]
	);
	const touchedInvalid = (name) => fieldTouched(name) && !fieldValid(name);
	const touchedValid = (name) => fieldTouched(name) && fieldValid(name);

	const setFieldError = (name, error) => {
		const updatedValue = {
			value: valueOf(name),
			touched: true,
			valid: false,
			error,
			originalError: values[name].error,
		};
		updateValue(name, updatedValue, formValid);
	};

	const inputProps = useCallback(
		(name) => ({
			...values[name],
			name,
			onChange:
				values[name].type === "checkbox" || values[name].type === "switch"
					? handleCheckboxChange
					: values[name].type === "select"
					? handleSelectChange
					: values[name].type === "multiselect"
					? handleMultiSelectChange
					: values[name].type === "location"
					? handleLocationChange
					: handleChange,
			onBlur: () => handleBlur(name),
			onFocus: () => setFieldTouched(name),
		}),
		[
			handleChange,
			handleCheckboxChange,
			handleMultiSelectChange,
			handleSelectChange,
			handleLocationChange,
			setFieldTouched,
			values,
		]
	);

	return {
		values,
		valueOf,
		handleChange,
		showError,
		inputProps,
		fieldValid,
		fieldTouched,
		touchedValid,
		touchedInvalid,
		formValid,
		showErrorIfInvalid,
		reset,
		formattedValues,
		setAllTouched,
		setFieldError,
	};
}
