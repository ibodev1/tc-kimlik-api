# TC Kimlik Doğrulama API

[NVİ](https://nvi.gov.tr/) Bu servis, TC Kimlik doğrulama işlemlerini gerçekleştiren bir Rest API hizmetidir. Ticari
amaçlarla kullanılmaması gerekmektedir. İletişim için [mail adresim](mailto:me@ibrahimo.dev) üzerinden ulaşabilirsiniz.

[Servis URL](https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?op=TCKimlikNoDogrula)

## Kullanım

POST Request atacağınız url adresi:
[https://tc-kimlik.ibrahimo.dev/api/dogrula](https://tc-kimlik.ibrahimo.dev/api/dogrula)

Alternatif:
[https://tc-kimlik.ibodev.deno.net/api/dogrula](https://tc-kimlik.ibodev.deno.net/api/dogrula) 

Örnek Body:

```json
{
  "tc": "TC_KIMLIK_NO",
  "ad": "AD",
  "soyad": "SOYAD",
  "dogumTarihi": "YYYY-MM-DD"
}
```

Örnek Response:

```json
{
  "status": "success",
  "result": true,
  "legalAge": false
}
```
