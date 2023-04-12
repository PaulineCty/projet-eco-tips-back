# Je prends l'identité de spedata :
export PGUSER=spedata

# Je supprime la BDD ecotips et l'utilisateur ecotips
dropdb ecotips
echo "BDD supprimée"
dropuser ecotips
echo "ecotips supprimé"

# Je crèe la BDD ecotips et l'utilisateur admin_ocolis
createuser ecotips -P
echo "ecotips créé"
createdb ecotips -O ecotips
echo "BDD créée"

# Je supprime sqitch.conf et sqitch.plan
rm sqitch.conf
rm sqitch.plan

# J'initiase Sqitch
sqitch init ecotips --target db:pg:ecotips
echo "Sqitch initialisé"