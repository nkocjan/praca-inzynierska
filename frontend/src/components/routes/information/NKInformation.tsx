import Grid from "@mui/material/Grid2";
import {
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";

const NKInformation = () => {
    return (
        <Grid container spacing={3} sx={{ padding: 3, marginTop: 5 }}>
            <Grid size={12}>
                <Typography variant="h4" gutterBottom>
                    Informacje o aplikacji
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Aplikacja do zarządzania budżetami i wydatkami w kategoriach — zaprojektowana jako projekt
                    portfolio oraz przykład rozwiązania opartego o mikroserwisy.
                </Typography>
            </Grid>

            <Grid size={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        1) Instrukcja korzystania (dla nietechnicznych)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="1. Zarejestruj konto i zaloguj się"
                                secondary="Po zalogowaniu aplikacja zapamięta Twoją sesję i pokaże panel główny."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="2. Dodaj kategorie"
                                secondary="Kategorie to np. Jedzenie, Transport, Rozrywka — w nich grupujesz wydatki i budżety."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="3. Ustaw budżety"
                                secondary="Dla każdej kategorii możesz ustawić budżet tygodniowy, miesięczny i roczny."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="4. Dodawaj wydatki"
                                secondary="Wydatki przypisujesz do kategorii, z datą i kwotą. Aplikacja zestawia je z budżetem."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="5. Sprawdzaj dashboard"
                                secondary="W panelu głównym zobaczysz podsumowania, wykresy oraz informację czy mieścisz się w budżecie."
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="6. Zarządzaj danymi w ustawieniach"
                                secondary="Możesz zmienić dane konta, zresetować dane lub usunąć konto."
                            />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>

            <Grid size={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        2) Opis techniczny (dla technicznych)
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="body1" gutterBottom>
                        Rozwiązanie jest oparte o architekturę rozproszoną: frontend komunikuje się z warstwą BFF
                        (Backend For Frontend), a BFF orkiestruje wywołania do niezależnych mikroserwisów.
                    </Typography>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Skład systemu:
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Frontend (React + TypeScript)"
                                    secondary="Aplikacja SPA: widoki, formularze, wykresy, walidacja, komunikacja HTTP."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="BFF (Spring Boot)"
                                    secondary="Jedno wejście z frontu, autoryzacja JWT, agregacja danych, wywołania OpenFeign do serwisów."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="user-service"
                                    secondary="Operacje konta użytkownika (np. rejestracja, logowanie, dane profilu)."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="budget-service"
                                    secondary="Kategorie oraz budżety (np. tygodniowy/miesięczny/roczny), logika resetowania budżetów."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="expense-service"
                                    secondary="Wydatki oraz operacje bulk (np. reset danych), przygotowanie danych do dashboardu."
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Bazy danych (PostgreSQL)"
                                    secondary="Oddzielne bazy dla serwisów; część środowiska zakłada replikację instancji expense DB."
                                />
                            </ListItem>
                        </List>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                        Bezpieczeństwo: komunikacja front→BFF używa tokenu JWT (Bearer), a BFF przekazuje kontekst
                        użytkownika do mikroserwisów.
                    </Typography>
                </Paper>
            </Grid>

            <Grid size={12}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="h5" gutterBottom>
                        3) Wykorzystane technologie
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Typography variant="subtitle1" gutterBottom>
                        Frontend
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText primary="React + TypeScript" secondary="SPA, komponenty, routing" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Vite" secondary="Dev server i build" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Material UI" secondary="Komponenty UI" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Axios" secondary="Komunikacja HTTP + interceptory" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Formik + Yup" secondary="Formularze + walidacja" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="notistack" secondary="Powiadomienia (snackbars)" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Chart.js" secondary="Wizualizacje na dashboardzie" />
                        </ListItem>
                    </List>

                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Backend
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText primary="Java 21" secondary="Język/Platforma" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Spring Boot 3" secondary="REST, konfiguracja, Actuator" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Spring Security + JWT" secondary="Autoryzacja i ochrona endpointów" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Spring Data JPA / Hibernate" secondary="Warstwa danych" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="OpenFeign" secondary="Komunikacja BFF→mikroserwisy" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Kafka" secondary="Komunikacja asynchroniczna (eventy)" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="MapStruct + Lombok" secondary="Mapowania DTO i redukcja boilerplate" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="OpenAPI / springdoc" secondary="Dokumentacja API" />
                        </ListItem>
                    </List>

                    <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                        Infrastruktura / narzędzia
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText primary="PostgreSQL 16" secondary="Bazy danych dla mikroserwisów" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Docker + Docker Compose" secondary="Uruchamianie środowiska lokalnie" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Maven" secondary="Budowanie backendu" />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="OpenAPI Generator" secondary="Generowanie klienta API dla frontendu" />
                        </ListItem>
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default NKInformation;