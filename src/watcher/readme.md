
# 流程
```$xslt
data => bait => wire => vibrator
一个 data 的一个 key 关联一个 bait -- 内部实现
一个 bait 关联多个 wire ------------ 内部实现
一个 wire 关联多个 terminal -------- 内部实现
```

- 其中 `terminal` 需要调用者实现
- `terminal` 需要实现 `.link` 方法，用来与 `wire` 进行关联
- `terminal` 需要实现 `.pipe` 方法，用来与 `wire` 信号传输
- `terminal` 如果不需要关联，则需要主动调用 `wire.unlink(terminal)` 切断关联
