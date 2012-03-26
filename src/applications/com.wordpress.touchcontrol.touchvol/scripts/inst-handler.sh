#!/bin/sh

/usr/bin/luna-send -n 1 palm://com.palm.applicationManager/removeHandlersForAppId '{"appId":"com.wordpress.touchcontrol.touchvol"}'
/usr/bin/luna-send -n 1 palm://com.palm.applicationManager/addResourceHandler '{"appId":"com.wordpress.touchcontrol.touchvol","extension":"tvp","mimeType":"application/touchvol","shouldDownload":true}'