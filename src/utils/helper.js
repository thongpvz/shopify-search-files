export function RegexNumber(str) {
    const regex = new RegExp("(\\d+(\\.\\d+)?)", "g")
    const tmp = regex.exec(str)

    try {
        if (tmp === null) {
            return 0
        }
        const result = tmp.shift()
        return parseInt(result)
    } catch (error) {
        return 0
    }
}

export function extractNumber(doc, element) {
    const el = doc.querySelector(element)
    if (el === null) {
        return 0
    }
    const text = el && el.textContent
    return RegexNumber(text)
}

export function RemoveAttributes(el, _except_attrs = []) {
    for (let i = el.attributes.length - 1; i >= 0; i--) {
        if (_except_attrs.length > 0) {
            // 
            if (_except_attrs.indexOf(el.attributes[i].name) == -1) {
                el.removeAttribute(el.attributes[i].name);
            }
        } else {
            el.removeAttribute(el.attributes[i].name);
        }
    }

    return el;
}

export function RemoveAttributesAllChild(el, _except_attrs = []) {
    const el_childs = el.getElementsByTagName('*');

    for (let i = 0; i < el_childs.length; i++) {
        RemoveAttributes(el_childs[i], _except_attrs);
    }

    return el;
}

export function ImageToBase64(url) {
    return new Promise((resolve) => {
        let image = new Image();

        image.setAttribute('crossOrigin', 'anonymous');
        image.onload = function () {
            let canvas = document.createElement('canvas');
            canvas.height = this.naturalHeight;
            canvas.width = this.naturalWidth;
            canvas.getContext('2d').drawImage(this, 0, 0);

            const b64data = canvas.toDataURL('image/png').replace(/^data:image\/(png|jpg);base64,/, '');
            resolve(b64data);
        };
        image.src = url;
    });
}

export function CapitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function ParseURL(url) {
    let parsed_url = {}

    if (url == null || url.length == 0)
        return parsed_url;

    let protocol_i = url.indexOf('://');
    parsed_url.protocol = url.substr(0, protocol_i);

    let remaining_url = url.substr(protocol_i + 3, url.length);
    let domain_i = remaining_url.indexOf('/');
    domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
    parsed_url.domain = remaining_url.substr(0, domain_i);
    parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

    let domain_parts = parsed_url.domain.split('.');
    switch (domain_parts.length) {
        case 2:
            parsed_url.subdomain = null;
            parsed_url.host = domain_parts[0];
            parsed_url.tld = domain_parts[1];
            break;
        case 3:
            parsed_url.subdomain = domain_parts[0];
            parsed_url.host = domain_parts[1];
            parsed_url.tld = domain_parts[2];
            break;
        case 4:
            parsed_url.subdomain = domain_parts[0];
            parsed_url.host = domain_parts[1];
            parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
            break;
    }

    parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

    return parsed_url;
}

export function StripTags(text) {
    return text.replace(/(<([^>]+)>)/ig, '');
}