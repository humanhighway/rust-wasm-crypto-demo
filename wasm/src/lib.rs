extern crate aes;
extern crate lazy_static;

mod utils;
use wasm_bindgen::prelude::*;
use wasm_bindgen::JsCast;
use web_sys::{ErrorEvent, MessageEvent, WebSocket};

use aes::Aes256;
use block_modes::block_padding::Pkcs7;
use block_modes::{BlockMode, Cbc};

use lazy_static::lazy_static;
use std::cell::RefCell;

use js_sys::JsString;

use crate::utils::set_panic_hook;

type AesCbc = Cbc<Aes256, Pkcs7>;

const KEY: &[u8; 32] = b"01234567012345670123456701234567";
const IV: &[u8; 16] = b"0123456701234567";

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);

    fn onSocketOpen();
    fn onSocketMessage(s: &str);
}

macro_rules! console_log {
    ($($t:tt)*) => (log(&format_args!($($t)*).to_string()))
}

struct SocketService {
    instance: RefCell<Result<WebSocket, JsValue>>,
}

unsafe impl Send for SocketService {}
unsafe impl Sync for SocketService {}

lazy_static! {
    static ref SOCKET: SocketService = SocketService {
        instance: RefCell::new(WebSocket::new("ws://localhost:8080")),
    };
}

fn encrypt(data: &String) -> String {
    let cipher = AesCbc::new_var(KEY, IV).unwrap();
    let cipher_text = cipher.encrypt_vec(data.as_bytes());
    base64::encode(&cipher_text)
}

fn decrypt(data: &String) -> String {
    let bytes = base64::decode(data).unwrap();
    let cipher = AesCbc::new_var(KEY, IV).unwrap();
    String::from_utf8(cipher.decrypt_vec(&bytes).unwrap()).unwrap()
}

#[wasm_bindgen(start)]
pub fn start_websocket() -> Result<(), JsValue> {
    set_panic_hook();
    // let ws = WebSocket::new("ws://localhost:8080")?;
    let _ws = SOCKET.instance.borrow().as_ref().unwrap().clone();
    _ws.set_binary_type(web_sys::BinaryType::Arraybuffer);
    let onmessage_callback = Closure::wrap(Box::new(move |e: MessageEvent| {
        let str = e.data().dyn_into::<js_sys::JsString>().unwrap();
        let str = match str.as_string() {
            Some(name) => name,
            None => "".to_string(),
        };
        console_log!("before decrypt: {:?}", str);
        let _message = decrypt(&str);
        console_log!("after decrypt: {:?}", _message);
        onSocketMessage(&_message);
    }) as Box<dyn FnMut(MessageEvent)>);
    _ws.set_onmessage(Some(onmessage_callback.as_ref().unchecked_ref()));
    onmessage_callback.forget();

    let onerror_callback = Closure::wrap(Box::new(move |e: ErrorEvent| {
        console_log!("error event: {:?}", e);
    }) as Box<dyn FnMut(ErrorEvent)>);

    _ws.set_onerror(Some(onerror_callback.as_ref().unchecked_ref()));
    onerror_callback.forget();
    let onopen_callback = Closure::wrap(Box::new(move |_| {
        console_log!("socket opened");
        onSocketOpen();
    }) as Box<dyn FnMut(JsValue)>);
    _ws.set_onopen(Some(onopen_callback.as_ref().unchecked_ref()));
    onopen_callback.forget();
    Ok(())
}

#[wasm_bindgen]
pub fn send(message: JsString) {
    let str = match message.as_string() {
        Some(name) => name,
        None => "".to_string(),
    };
    let str = encrypt(&str);
    match SOCKET
        .instance
        .borrow()
        .as_ref()
        .unwrap()
        .send_with_str(&str)
    {
        Ok(_) => console_log!("message successfully sent"),
        Err(err) => console_log!("error sending message: {:?}", err),
    }
}
