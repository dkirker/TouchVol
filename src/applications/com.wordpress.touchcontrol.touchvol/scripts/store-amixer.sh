#!/bin/sh
ID=/media/cryptofs/apps/usr/palm/applications/com.wordpress.touchcontrol.touchvol/scripts
rm $ID/amixer-restore.state

CONTROLS="
AIF1DAC1_EQ1_Volume \
AIF1DAC1_EQ2_Volume \
AIF1DAC1_EQ3_Volume \
AIF1DAC1_EQ4_Volume \
AIF1DAC1_EQ5_Volume \
IN1L_Volume \
IN2L_Volume \
AIF1DAC1_EQ_Switch \
AIF1DAC1_3D_Stereo_Volume \
AIF1DAC1_3D_Stereo_Switch \
AIF1_Boost_Volume \
Headphone_Volume \
DAC1_Volume \
"

for i in $CONTROLS
do
i=$(echo \'$i\' | sed -e 's/_/ /g')
echo -n "cset name=$i " >> $ID/amixer-restore.state
/usr/bin/amixer cget name="$i" | sed -n '3p' | cut -d= -f2 >> $ID/amixer-restore.state
done