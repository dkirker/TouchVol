#!/bin/sh
ID=/media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/scripts
rm $ID/amixer-restore.state

CONTROLS="
92 \
151 \
21 \
22 \
23 \
24 \
25 \
115 \
152 \
117 \
"

for i in $CONTROLS
do
echo -n "cset numid=$i " >> $ID/amixer-restore.state
amixer cget numid=$i | sed -n '3p' | cut -d= -f2 >> $ID/amixer-restore.state
done
