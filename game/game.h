#ifndef H_POTATO_GAME
#define H_POTATO_GAME

#include <random>
#include <string>
#include <node.h>
#include <node_buffer.h>
#include <cstdio>

#define WINVER 0x0A00 // >= Windows 10
#include <windows.h>
#include <Psapi.h>
#include <tlhelp32.h>

#define NO_VIRTUAL_KEY 0

#define NO_TIMESTAMP 0

#define NO_EXTRA_INFO 0

#define SINGLE_INPUT 1

#define KEY_METHOD_EXCEPTION(MSG) Exception::TypeError(String::NewFromUtf8(isolate, MSG))
#define READ_MEMORY_EXCEPTION(MSG) Exception::Error(String::NewFromUtf8(isolate, MSG))

// Spawn Info Offsets
#define SpawnInfoSize 0x27f0
#define NextOffset 0x4
#define PrevOffset 0x8
#define LastnameOffset 0x38
#define XOffset 0x64
#define YOffset 0x68
#define ZOffset 0x6c
#define SpeedOffset 0x7c
#define HeadingOffset 0x80
#define NameOffset 0xa4
#define TypeOffset 0x125
#define SpawnIDOffset 0x148
#define OwnerIDOffset 0x5f0
#define HideOffset 0x260
#define LevelOffset 0x2b1
#define ClassOffset 0xf8c
#define RaceOffset 0xf84
#define PrimaryOffset 0x1094
#define OffhandOffset 0x10a8


namespace potato {
	// Base Code for Process Sniffing based on MyShowEQ Server
    void OpenProcessMethod(const v8::FunctionCallbackInfo<v8::Value>&);
    void ReadMemoryMethod(const v8::FunctionCallbackInfo<v8::Value>&);
    void ReadMemoryMethod(const v8::FunctionCallbackInfo<v8::Value>&);
    void GetBaseAddressMethod(const v8::FunctionCallbackInfo<v8::Value>&);

    void GetZoneMethod(const v8::FunctionCallbackInfo<v8::Value>&);
    void GetCharMethod(const v8::FunctionCallbackInfo<v8::Value>&);

    // DirectX Keyboard Event Scan Code Simulating
    void KeyDownMethod(const v8::FunctionCallbackInfo<v8::Value>&);
    void KeyUpMethod(const v8::FunctionCallbackInfo<v8::Value>&);
    
    // Module Init
    void init(v8::Local<v8::Object>);
}

#endif
