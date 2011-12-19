find . -type d -exec chmod 755 {} \;
chmod -R 744 *
chmod 755 prerm postinst pmPreRemove.script pmPostInstall.script
chown -R root:root *
dos2unix control prerm postinst pmPostInstall.script pmPreRemove.script
tar -cvzf control.tar.gz ./control ./prerm ./postinst
cd src
for f in `find . -name "*.touchpad"`
do
mv $f ${f/.touchpad/}
done
mkdir -p ./usr/palm
mv * ./usr/palm
dos2unix `find ./ -name *.js -o -name *.sh -o -name *.css -o -name *.json -name *.html -type f`
tar -cvzf ../data.tar.gz ./*
cd ..
ar -r com.wordpress.touchcontrol.touchvol_0.1.0_all.ipk debian-binary pmPostInstall.script pmPreRemove.script control.tar.gz data.tar.gz
rm *.gz
