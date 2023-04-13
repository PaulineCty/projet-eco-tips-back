# Being the user spedata, I can then,
export PGUSER=spedata

# delete the ecotips DB and user,
dropdb ecotips
echo "BDD supprimée"
dropuser ecotips
echo "ecotips supprimé"

# create the ecotips DB and user,
createuser ecotips -P
echo "ecotips créé"
createdb ecotips -O ecotips
echo "BDD créée"

# delete the sqitch.conf and sqitch.plan files,
rm sqitch.conf
rm sqitch.plan

# initiate sqitch.
sqitch init ecotips --target db:pg:ecotips
echo "Sqitch initialisé"