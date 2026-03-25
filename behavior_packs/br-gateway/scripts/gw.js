import { TimeOfDay, world, system } from "@minecraft/server";
import { HttpRequest, HttpHeader, HttpRequestMethod, http } from '@minecraft/server-net';
import { ModalFormData } from '@minecraft/server-ui';
import { transferPlayer } from '@minecraft/server-admin';
let serverData = [];
let serverMetadataURL = 'http://172.10.10.10/serverlist.json';
let serverHookURL = 'http://172.10.10.10/myhook';
let serverHookToken = 'my-auth-token';
let serverHostname = 'my.minecraft.example.com';


http.get(serverMetadataURL).then((response) => {
    const body = response.body;
    console.log(body);
    serverData = JSON.parse(body);
});

function performRouting(player, choice) {
    serverData.forEach((value) => {
        if (value.name == choice) { transferPlayer(player, { hostname: serverHostname, port: value.port }); }

    });

}

world.afterEvents.playerSpawn.subscribe((eventData) => {
    eventData.player.sendMessage("Welcome! Interact with a block or entity to transfer to a server.!");
    world.setTimeOfDay(TimeOfDay.Day);
    world.gameRules.doWeatherCycle = false;
    world.gameRules.doDayLightCycle = false;
});

world.afterEvents.chatSend.subscribe((eventData) => {
    console.log(JSON.stringify(eventData)); console.log(eventData.message);
    sendHook(eventData.sender.name, eventData.message);
});

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    event.cancel = true;
    event.player.sendMessage("You can't break blocks!");
});

world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    event.cancel = true;
    event.player.sendMessage("You can't place blocks!");
    console.log("Player invoked server selector dialog:", event.player.name);
    let form = new ModalFormData();
    let effectList = [];
    serverData.forEach((value) => {
        effectList.push(value.name);
    });

    form.title("Server selector");
    form.dropdown("World", effectList);
    system.run(() => {

        form.show(event.player)
            .then((r) => {
                if (r.canceled) return;
                console.log('ServerSelector: ' + event.player.name + ' -> ' + effectList[r.formValues]);
                console.log(JSON.stringify(serverData));
                sendHook(event.player.name, effectList[r.formValues]);
                performRouting(event.player, effectList[r.formValues]);

            })
            .catch((e) => {
                console.error(e, e.stack);
            });
    });

});

//
world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
    event.cancel = true;
    event.player.sendMessage("Invoking selector!");
    console.log("Player invoked server selector dialog:", event.player.name);
    let form = new ModalFormData();
    let effectList = [];
    serverData.forEach((value) => {
        effectList.push(value.name);
    });
    form.title("Server selector");
    form.dropdown("World", effectList);
    system.run(() => {

        form.show(event.player)
            .then((r) => {
                if (r.canceled) return;
                console.log('ServerSelector: ' + event.player.name + ' -> ' + effectList[r.formValues]);
                sendHook(event.player.name, effectList[r.formValues]);
                performRouting(event.player, effectList[r.formValues]);
            })
            .catch((e) => {
                console.error(e, e.stack);
            });
    });

});

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
    console.log("Player invoked server selector dialog:", event.player.name);
    let form = new ModalFormData();
    let effectList = [];
    serverData.forEach((value) => {
        effectList.push(value.name);
    });
    form.title("Server selector");
    form.dropdown("World", effectList);
    form.show(event.player)
        .then((r) => {
            if (r.canceled) return;
            console.log('ServerSelector: ' + event.player.name + ' -> ' + effectList[r.formValues]);
            sendHook(event.player.name, effectList[r.formValues]);
            performRouting(event.player, effectList[r.formValues]);
        })
        .catch((e) => {
            console.error(e, e.stack);
        });


});



world.afterEvents.playerSwingStart.subscribe((event) => {
    console.log("Player invoked server selector dialog:", event.player.name);
    let form = new ModalFormData();
    let effectList = [];
    serverData.forEach((value) => {
        effectList.push(value.name);
    });
    form.title("Server selector");
    form.dropdown("World", effectList);
    form.show(event.player)
        .then((r) => {
            if (r.canceled) return;
            console.log('ServerSelector: ' + event.player.name + ' -> ' + effectList[r.formValues]);
            sendHook(event.player.name, effectList[r.formValues]);
            performRouting(event.player, effectList[r.formValues]);
        })
        .catch((e) => {
            console.error(e, e.stack);
        });


});




async function sendHook(event1, event2) {
    const req = new HttpRequest(serverHookURL + '/' + event1 + '/' + event2);
    console.log('POSTing to ' + serverHookURL + '/' + event1 + '/' + event2);
    req.body = JSON.stringify({
        user: event1,
        message: event2,
    });

    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader('Content-Type', 'application/json'),
        new HttpHeader('auth', serverHookToken),
    ];

    await http.request(req);
}
