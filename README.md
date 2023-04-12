# TC Kimlik Doğrulama API
[NVİ](https://nvi.gov.tr/) Bu servis, TC Kimlik doğrulama işlemlerini gerçekleştiren bir Rest API hizmetidir.

[Servis URL](https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx?op=TCKimlikNoDogrula)

## Kullanım
POST Request atacağınız url adresi:
[https://tc-kimlik.vercel.app/api/dogrula](https://tc-kimlik.vercel.app/api/dogrula)

Örnek Body:
```json
{
    "tc":"TC_KIMLIK_NO",
    "ad":"AD",
    "soyad":"SOYAD",
    "dogumTarihi":"YYYY-MM-DD"
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
