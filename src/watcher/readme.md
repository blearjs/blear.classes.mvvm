
# 流程
```$xslt
data => bait => wire => vibrator
一个 data 的一个 key 关联一个 bait -- 内部实现
一个 bait 关联多个 wire ------------ 内部实现
一个 wire 关联多个 vibrator -------- 内部实现
```

- 其中 `vibrator` 需要调用者实现
- `vibrator` 需要实现 `.link` 方法，用来与 `wire` 进行关联
- `vibrator` 需要实现 `.unlink` 方法，用来与 `wire` 切断关联
- `vibrator` 需要实现 `.pipe` 方法，用来与 `wire` 进行传输
