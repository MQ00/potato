/** game.node
  * 
  * Use Windows API call SendInput to send a hardware scan code
  * message to the operating system.  This assumes that EverQuest
  * is already in the forground since you cannot send messages
  * directly to the game.  Using hardware scan codes work with
  * DirectInput where virtual-key values do not.
  *
  * @see SendInput Documentation
  *     https://msdn.microsoft.com/en-us/library/windows/desktop/ms646310(v=vs.85).aspx
  *
  * @see DirectInput Keyboard Scan Codes
  *     http://www.gamespp.com/directx/directInputKeyboardScanCodes.html
  * */

#include "game.h"

namespace potato {

    using v8::Array;
    using v8::Exception;
    using v8::Function;
    using v8::FunctionCallbackInfo;
    using v8::Isolate;
    using v8::Local;
    using v8::Object;
    using v8::String;
    using v8::Value;
    using v8::Number;

    HANDLE currentEQProcessHandle = NULL;
    DWORD currentEQProcessID = 0;
    DWORD_PTR currentEQProcessBaseAddress = 0x400000;

    void EnableDebugPrivileges() {
        // Allows this process to peek into other another processes memory space.

        TOKEN_PRIVILEGES TP, OldTP;
        LUID ALUID;
        HANDLE hToken;
        DWORD Bufferlen;


		DWORD privs = TOKEN_ADJUST_PRIVILEGES ^ TOKEN_QUERY;
		printf("privs = %d;\n", privs);

        BOOLEAN worked = OpenProcessToken(GetCurrentProcess(), TOKEN_ADJUST_PRIVILEGES ^ TOKEN_QUERY, &hToken);
		printf("worked = OpenProcessToken(...); // %d\n", worked);
		printf("hToken; // %d\n", hToken);

        LookupPrivilegeValue(NULL, SE_DEBUG_NAME, &ALUID);

        TP.PrivilegeCount = 1;
        TP.Privileges[0].Luid = ALUID;
        TP.Privileges[0].Attributes = SE_PRIVILEGE_ENABLED;

        AdjustTokenPrivileges(hToken, false, &TP, sizeof(OldTP), &OldTP, &Bufferlen);
        CloseHandle(hToken);
    }


    DWORD_PTR GetModuleBaseAddress(DWORD iProcId, TCHAR* DLLName) {
        HANDLE hSnap; // Process snapshot handle.
        MODULEENTRY32 xModule; // Module information structure.

        // Creates a module
        if ((hSnap = CreateToolhelp32Snapshot(TH32CS_SNAPMODULE, iProcId)) == INVALID_HANDLE_VALUE) {
            return 0;
        }

        // Needed for Module32First/Next to work.
        xModule.dwSize = sizeof(MODULEENTRY32); 
    
        BOOL bModule = Module32First(hSnap, &xModule);
        while (bModule) {
            // If this is the module we want, return the base address.
            if (lstrcmpi (xModule.szModule, DLLName) == 0)  {
                CloseHandle(hSnap);
                return (DWORD_PTR)xModule.modBaseAddr;  // @todo figure out this cast warning!
            }

            // Loop through the rest of the modules.
            bModule = Module32Next(hSnap, &xModule); 
        }

        // Free the handle.
        CloseHandle(hSnap); 

        return 0;
    }


    void OpenProcessMethod(const FunctionCallbackInfo<Value>& args) {
        EnableDebugPrivileges();
        Isolate* isolate = args.GetIsolate();
        //Local<Function> cb = Local<Function>::Cast(args[0]);
        const std::string eqgameExe("eqgame.exe");

        const unsigned argc = 1;

        bool rtn = false;
        HANDLE hProcessSnap = NULL; 
        PROCESSENTRY32 pe32 = {0}; 
        pe32.dwSize = sizeof(PROCESSENTRY32);

        hProcessSnap = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0); 
        if (Process32First(hProcessSnap, &pe32)) {
            do {
                std::string procExe(pe32.szExeFile);

                if (procExe.find(eqgameExe.c_str()) != std::string::npos) {

                    if (OpenProcess(PROCESS_VM_READ|PROCESS_VM_WRITE|PROCESS_VM_OPERATION, false, pe32.th32ProcessID)) {
                        
                        currentEQProcessID = pe32.th32ProcessID;
                        currentEQProcessHandle = OpenProcess(PROCESS_VM_READ|PROCESS_VM_WRITE|PROCESS_VM_OPERATION, false, currentEQProcessID);
                        currentEQProcessBaseAddress = GetModuleBaseAddress(pe32.th32ProcessID, pe32.szExeFile);

                        rtn = true;
                        break;
                    }
                }


            } while (hProcessSnap && Process32Next(hProcessSnap, &pe32));
        }

        args.GetReturnValue().Set(Number::New(isolate, currentEQProcessID));
    }


    void ReadMemoryMethod(const v8::FunctionCallbackInfo<v8::Value>& args) {
        Isolate* isolate = args.GetIsolate();

        const unsigned argc = 2;
        UINT offset = (UINT)(args[0]->Uint32Value());
        UINT size = (UINT)(args[1]->Uint32Value());
        SIZE_T read;
        char* buffer;
        buffer = new char[size];
        memset(buffer, 0, size);

        bool rtn = ReadProcessMemory(currentEQProcessHandle, (void*)offset,  (void*)buffer, size, &read) != 0;
        
        if (rtn) {
            Local<Array> myArray = Array::New(isolate);
            for (int i = 0; i < read; i++) {
                myArray->Set(i, Number::New(isolate, buffer[i]));
            }
            
            args.GetReturnValue().Set(myArray);
        } else {
            args.GetReturnValue().Set(Number::New(isolate, 0));
        }
        delete [] buffer;
    }

    

    void WriteMemoryMethod(const v8::FunctionCallbackInfo<v8::Value>& args) {
        Isolate* isolate = args.GetIsolate();

        const unsigned argc = 2;
        UINT offset = (UINT)(args[0]->Uint32Value());

        Local<Object> bufferObj = args[1]->ToObject();
        char* buffer = (char*) node::Buffer::Data(bufferObj);
        SIZE_T size = node::Buffer::Length(bufferObj);
        SIZE_T wrote;

        bool rtn = WriteProcessMemory(currentEQProcessHandle, (void*)offset, (void*)buffer, size, &wrote) != 0;

        args.GetReturnValue().Set(Number::New(isolate, (rtn ? wrote : 0)));
    }


    void GetBaseAddressMethod(const v8::FunctionCallbackInfo<v8::Value>& args) {
        Isolate* isolate = args.GetIsolate();
        args.GetReturnValue().Set(Number::New(isolate, currentEQProcessBaseAddress));
    }


    UINT readRawPointer(UINT offset) {
        UINT raw_offset = offset - 0x400000 + currentEQProcessBaseAddress;
        UINT result = 0;
        ReadProcessMemory(currentEQProcessHandle, (void*)raw_offset, (void*)&result, sizeof(result), NULL);
        return result;
    }


    void GetZoneMethod(const v8::FunctionCallbackInfo<v8::Value>& args) {
        Isolate* isolate = args.GetIsolate();
        
        const UINT offset = 0xf369c4 - 0x400000 + currentEQProcessBaseAddress;

        const SIZE_T b_size = 30;
        char buffer[b_size];
        memset(buffer, 0, b_size);

        if (ReadProcessMemory(currentEQProcessHandle, (void*)offset, (void*)buffer, b_size, NULL) != 0) {
            std::string zone_name = buffer;
            args.GetReturnValue().Set(String::NewFromUtf8(isolate, zone_name.c_str()));
        } else {
            isolate->ThrowException(READ_MEMORY_EXCEPTION("Could not read ZoneAddr"));
        }
    }


    void GetCharMethod(const v8::FunctionCallbackInfo<v8::Value>& args) {
        Isolate* isolate = args.GetIsolate();
        const UINT offset_CharInfo = 0xf29040; // see EQPLAYER__EQPlayer_x
        const UINT offset_Info_Name = 0xa4;

        UINT pSelf = readRawPointer(offset_CharInfo);

        const UINT offset = pSelf;
        
        const SIZE_T b_size = SpawnInfoSize;
        char buffer[b_size];
        memset(buffer, 0, b_size);


        if (ReadProcessMemory(currentEQProcessHandle, (void*)offset, (void*)buffer, b_size, NULL) != 0) {

            Local<Object> obj = Object::New(isolate);
            obj->Set(String::NewFromUtf8(isolate, "pSelf"), Number::New(isolate, pSelf));

            Local<Array> myArray = Array::New(isolate);
            for (int i = 0; i < b_size; i++) {
                myArray->Set(i, Number::New(isolate, buffer[i]));
            }
            obj->Set(String::NewFromUtf8(isolate, "data"), myArray);

            std::string name(&buffer[NameOffset]);
            obj->Set(String::NewFromUtf8(isolate, "name"), String::NewFromUtf8(isolate, name.c_str()));

            std::string last_name(&buffer[LastnameOffset]);
            obj->Set(String::NewFromUtf8(isolate, "last_name"), String::NewFromUtf8(isolate, last_name.c_str()));

            args.GetReturnValue().Set(obj);
        } else {
            isolate->ThrowException(READ_MEMORY_EXCEPTION("Could not read Char SpawnInfo"));
        }
    }


    
    void KeyDownMethod(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();

        // Require Scan Code to Send
        if (args.Length() < 1) {
            isolate->ThrowException(KEY_METHOD_EXCEPTION("Scan Code Required"));
            return;
        }

        // Scan Code Must be a Number
        if (!args[0]->IsNumber()) {
            isolate->ThrowException(KEY_METHOD_EXCEPTION("Scan Code Must be a Number"));
        }

        double value = args[0]->NumberValue();
        WORD scan_code = static_cast<WORD>(floor(value));

        // Time for some Windows shit...
        INPUT input;

        input.type = INPUT_KEYBOARD;             // Input is a Keyboard event
        input.ki.wVk = NO_VIRTUAL_KEY;           // Not a Virtual-Key code
        input.ki.wScan = scan_code;              // The actual scan code being sent
        input.ki.dwFlags = KEYEVENTF_SCANCODE;   // Flag Input as a hardware Scan Code
        input.ki.time = NO_TIMESTAMP;            // Allow system to timestamp input itself
        input.ki.dwExtraInfo = NO_EXTRA_INFO;    // No Extra Info associated with Input

        // Use SendInput to issue the hardware scan code message
        SendInput(SINGLE_INPUT, &input, sizeof(INPUT));
    }


    void KeyUpMethod(const FunctionCallbackInfo<Value>& args) {
        Isolate* isolate = args.GetIsolate();

        // Require Scan Code to Send
        if (args.Length() < 1) {
            isolate->ThrowException(KEY_METHOD_EXCEPTION("Scan Code Required"));
            return;
        }

        // Scan Code Must be a Number
        if (!args[0]->IsNumber()) {
            isolate->ThrowException(KEY_METHOD_EXCEPTION("Scan Code Must be a Number"));
        }

        double value = args[0]->NumberValue();
        WORD scan_code = static_cast<WORD>(floor(value));

        // Time for some Windows shit...
        INPUT input;

        input.type = INPUT_KEYBOARD;             // Input is a Keyboard event
        input.ki.wVk = NO_VIRTUAL_KEY;           // Not a Virtual-Key code
        input.ki.wScan = scan_code;              // The actual scan code being sent
        input.ki.time = NO_TIMESTAMP;            // Allow system to timestamp input itself
        input.ki.dwExtraInfo = NO_EXTRA_INFO;    // No Extra Info associated with Input
        
        // Flag Input as a hardware release Scan Code
        input.ki.dwFlags = KEYEVENTF_SCANCODE | KEYEVENTF_KEYUP;;   
            
        // Use SendInput to issue the hardware scan code message
        SendInput(SINGLE_INPUT, &input, sizeof(INPUT));
    }




    void init(Local<Object> exports) {
        EnableDebugPrivileges();
        NODE_SET_METHOD(exports, "openProcess", OpenProcessMethod);
        NODE_SET_METHOD(exports, "readMemory", ReadMemoryMethod);
        NODE_SET_METHOD(exports, "writeMemory", WriteMemoryMethod);
        NODE_SET_METHOD(exports, "getBaseAddress", GetBaseAddressMethod);

        NODE_SET_METHOD(exports, "getZone", GetZoneMethod);
        NODE_SET_METHOD(exports, "getChar", GetCharMethod);

        NODE_SET_METHOD(exports, "keyDown", KeyDownMethod);
        NODE_SET_METHOD(exports, "keyUp", KeyUpMethod);
    }

    NODE_MODULE(game, init)

}
