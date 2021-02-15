import React, {useEffect} from 'react';
import io from 'socket.io-client'

export const SOCKET = io('http://moshmatch.com:5000', {
});

export const baseUrl = () => {
    return "https://moshmatch.com/apprich/api"
}

// Common function toggle
export default function useToggle(initialValue = false) {
    const [value,
        setValue] = React.useState(initialValue);
    const toggle = React.useCallback(() => {
        setValue(v => !v);
    }, []);
    return [value, toggle];
}

export function addBodyClass(className) {
    return () => useEffect(() => {
        document.body.className = className;
        return () => {
            document.body.className = 'no-bg';
        }
    });

}

export function setStorage(key, value) {
    return localStorage.setItem(key, value);
}

export function removeStorage(key) {
    return localStorage.removeItem(key);
}

export function randomString(len = 5) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < len; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

export const addDefaultSrc = (ev) => {
    ev.target.src = '/assets/images/image-placeholder.jpg'
}

export const returnDefaultImage = (ev) => {
    return '/assets/images/image-placeholder.jpg'
}

export function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

 export function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}