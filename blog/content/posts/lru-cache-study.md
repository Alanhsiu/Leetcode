---
title: "深入淺出 LRU Cache：從 C++ 實作到 OS 記憶體管理"
date: 2024-05-20T12:00:00+08:00
draft: false
tags: ["LeetCode", "OS", "C++"]
---

## 題目解析
LRU (Least Recently Used) 是系統底層非常重要的淘汰演算法。

## C++ 實作要點
為了達到 O(1) 的存取效率，我們結合了：
* **std::unordered_map**: 快速查找。
* **Doubly Linked List**: 快速調整資料權重。

## 跨領域連結：作業系統 (OS)
這與我在筆記中提到的 **Virtual Memory** 概念高度相關。
當 OS 發生 **Page Fault** 且記憶體滿了，就會使用類似 LRU 的機制來決定置換哪個 Page。