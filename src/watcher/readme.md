
# 流程

- 一个 data 的一个 key 关联一个 wire
- data 层级之前使用 linker 来关联
- 一个 wire 关联多个 terminal


```
data => wire => terminal

{ --> linker --> wire --> [terminal1, ...]
    obj: --> wire --> [terminal1, ...]
        { --> linker --> wire --> [terminal1, ...]
            a: --> wire --> [terminal1, ...]
            b: --> wire --> [terminal1, ...]
        }
        
    arr: --> wire --> [terminal1, ...]
        [ --> linker --> wire --> [terminal1, ...]
           1,
           2
        ]
}
```

- 其中 `terminal` 需要调用者实现
- `terminal` 需要实现 `.link` 方法，用来与 `wire` 进行关联
- `terminal` 需要实现 `.pipe` 方法，用来与 `wire` 信号传输
- `terminal` 如果不需要关联，则需要主动调用 `wire.unlink(terminal)` 切断关联
