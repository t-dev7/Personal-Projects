#define _CRT_SECURE_NO_WARNINGS
#include <time.h>
#include <stdio.h>
#include <Windows.h>

void copyToClipboard(char* text) {

    const size_t len = strlen(text) + 1;    // copies length of the string
    HGLOBAL hMem = GlobalAlloc(GMEM_MOVEABLE, len); // allocates memory on global heap to store the string
    memcpy(GlobalLock(hMem), text, len);    // locks the allocated memory and copies it
    GlobalUnlock(hMem);       // unlocks the memory
    OpenClipboard(0);   // open clipboard for access
    EmptyClipboard();   // Empties the clipboard and frees handles to data in the clipboard
    SetClipboardData(CF_TEXT, hMem);    // Places data on the clipboard in a specified clipboard format
    CloseClipboard();   // Closes the clipboard.
}

int main()
{
    time_t now;
    time(&now);

    // Convert to local time
    struct tm* local = localtime(&now);

    // Format the date and time
    char buffer[80];
    strftime(buffer, 80, "%m/%d/%Y - %I:%M%p -", local);

    char* textToCopy = buffer;
    copyToClipboard(textToCopy);
    return 0;
}