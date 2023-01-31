import makeWASocket, { AuthenticationState, useMultiFileAuthState,  } from "@adiwajshing/baileys";


async function init(state: AuthenticationState) {


    const sock = makeWASocket({

        auth: state ,
        printQRInTerminal: true,
        patchMessageBeforeSending: (message) => {
            const requiresPatch = !!(
              message.buttonsMessage
              || message.templateMessage
              || message.listMessage
              );
              if (requiresPatch) {
                  message = {
                      viewOnceMessage: {
                          message: {
                              messageContextInfo: {
                                  deviceListMetadataVersion: 2,
                                  deviceListMetadata: {},
                                },
                                ...message,
                            },
                        },
                    };
                }
            return message;
        },
    
    
    })


    return sock



}

export {init}


