# shr-mfg-warehouse-erp

Overview of control applications for the warehouse model

```mermaid
    graph TD
    subgraph AA["&nbsp warehouse application stack &nbsp"]
        A[ERP]---|HTTP API I|B[MES]---|HTTP API II|C[Robot control]
    end

    style AA fill:#FAD7A0, stroke:#F5B041
```

* ERP this repo
* [MES repo](https://github.com/fsprojekti/shr-mfg-robotic-arm-warehouse)
* [Robot control](https://github.com/fsprojekti/shr-mfg-robotic-arm-http-server)

## HTTP API documentation

### Warehouse ERP API

| Method | Path                                          | Description                        | Parameters | Response                                         |
|--------|-----------------------------------------------|------------------------------------|------------|--------------------------------------------------|
| GET    | `/account/get/`                               | get account data                   |            | {<br/>String address<br/>String privateKey<br/>} |
| GET    | `/account/balance/eth/get`                    | get account balance of ETH         |            | {<br/>String balance<br/>}                       |
| GET    | `/account/balance/token/get`                  | get account balance of Tokens      |            | {<br/>String balance<br/>}                       |
| GET    | `/capacity/pool/get`                          | get capacity pool                  |            | {<br/>String capacity<br/>}                      |
| GET    | `/capacity/pool/offer/get`                    | get offers from the pool           |            | {<br/>Array<Offer> offers<br/>}                  |
| GET    | `/capacity/registry/get`                      | get capacity registry              |            | {<br/>Object capacityRegistry<br/>}              |
| GET    | `/capacity/registry/providers/get`            | get list of capacity providers     |            | {<br/>Array<Providers> providers<br/>}           |
| GET    | `/capacity/registry/consumers/get`            | get list of capacity consumers     |            | {<br/>Array<Consumers> consumers<br/>}           |
| GET    | `/capacity/registry/provider/register/new`    | register new capacity provider url | String url | {<br/>String Address<br/>String url<br/>}        |
| GET    | `/capacity/registry/provider/register/update` | update capacity provider url       | String url | {<br/>String Address<br/>String url<br/>}        |

### Warehouse MES API

### Robot control API
