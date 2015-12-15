:: This file is intended for windows users: cloudman-cli can be called as cloudman "command" "parameters" without
:: adding the project to the Windows P@TH or calling node before the command.
 

@echo off

for /f "tokens=1-1*" %%a in ("%*") do (
    set par1=%%a
    set par2=%%b
    set par3=%%c
    set therest=%%d
)

:: Thanks to Patrick Cuff for this code at http://stackoverflow.com/questions/382587/how-to-get-batch-file-parameters-from-nth-position-on

::Yes, I need this is bulky. Need to learn batch.

node %0 %par1% %par2%