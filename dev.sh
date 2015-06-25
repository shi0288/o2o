#!/bin/sh




usage()
{
        echo "usage: `basename $0` start  参数缺失"
}
OPT=$1
tomcatValue=`ps -ef|grep jdk|grep -v grep|awk '{print $2}'`


if [ ${#tomcatValue} -ne 0 ];  then
                 kill -9  `ps -ef|grep jdk|grep -v grep|awk '{print $2}'`
fi

if [ $# -eq 0 ]; then
        usage
        exit 1
fi

echo '=========第一步开始打包==========='
gradle build
devSrc=build/artifacts/WEB-INF/lib/*
#打包路径
goalSrc=E:/apache-tomcat/webapps/
rm -rf E:/apache-tomcat/webapps/ROOT
rm -rf E:/apache-tomcat/webapps/ROOT.war
echo '=========第二步copy到容器==========='
cp -R $devSrc $goalSrc
echo '.'
echo '..'
echo '....'
echo '......'
echo '........'
echo '=========启动TOMCAT==========='
case $OPT in
        start|Start) echo "ReStarting.....$PROCESSID"
               #运行路径
               sh e:/apache-tomcat/bin/startup.sh
               echo "开启 tomcat 成功"
        ;;
        *)usage
        ;;
esac


echo '=========FINISH==========='