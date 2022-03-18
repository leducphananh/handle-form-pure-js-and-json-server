function Validator(options) {

    let selectorRules = {};

    // Hàm thực hiện validate
    function validate(inputElement, rule) {
        const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        let errorMessage = '';

        // Lấy ra hàm test trong rule của selector
        const testsOfSelector = selectorRules[rule.selector];

        for (let i = 0; i < testsOfSelector.length; i++) {
            errorMessage = testsOfSelector[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerHTML = errorMessage;
            inputElement.parentElement.classList.add('invalid');
            return 'Có lỗi';
        } else {
            errorElement.innerHTML = '';
            inputElement.parentElement.classList.remove('invalid');
            return 'Không có lỗi';
        }
    }

    // Lấy form element
    const formElement = document.querySelector(options.form);

    if (formElement) {
        // Handle submit form
        formElement.onsubmit = (e) => {
            e.preventDefault();
            let isFormValid = true;
            // Lặp qua từng rules và validate
            options.rules.forEach(rule => {
                const inputElement = formElement.querySelector(rule.selector);
                if (validate(inputElement, rule) === 'Có lỗi') {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                submitForm();
            } else {
                console.log('Có lỗi');
            }
        }

        options.rules.forEach((rule) => {
            // Lưu rules cho mỗi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test];
            }

            const inputElement = formElement.querySelector(rule.selector);
            const errorElement = inputElement.parentElement.querySelector(options.errorSelector);
            if (inputElement) {
                // Xử lí blur khỏi input
                inputElement.onblur = () => {
                    validate(inputElement, rule, errorElement);
                }

                // Xử lí mỗi khi người dùng nhập vào input
                inputElement.oninput = () => {
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove('invalid');
                }
            }
        });
    }
}

// khi có lỗi => trả message lỗi
// khi không có lỗi => không trả ra cái gì (undefined)
Validator.isRequired = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.trim() ? undefined : (message || 'Vui lòng nhập trường này');
        }
    }
}

Validator.isEmail = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : (message || 'Vui lòng nhập đúng email');
        }
    }
}

Validator.minLength = (selector, min, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value.length >= min ? undefined : (message || `Vui lòng nhập tối thiểu ${min} kí tự`);
        }
    }
}

Validator.isConfirmed = (selector, getConfirmedValue, message) => {
    return {
        selector: selector,
        test: (value) => {
            return value === getConfirmedValue() ? undefined : (message || 'Giá trị nhập vào không chính xác');
        }
    }
}

Validator.isDate = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
            return regex.test(value) ? undefined : (message || 'Vui lòng nhập đúng ngày sinh');
        }
    }
}

Validator.isPhoneNumber = (selector, message) => {
    return {
        selector: selector,
        test: (value) => {
            const regex = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
            return regex.test(value) ? undefined : (message || 'Vui lòng nhập đúng số điện thoại');
        }
    }
}
