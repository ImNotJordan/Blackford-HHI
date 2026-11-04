from pathlib import Path
import re

STAFF_NAV = """<div style="display: flex; flex-direction: column; gap: 2px">
<a href="01-Main.dc.html" data-nav="today" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">My work today</a>
<a href="02-ClientsList.dc.html" data-nav="clients" style="display: flex; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">Clients and pipeline</a>
<a href="07-Inbox.dc.html" data-nav="inbox" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">Shared inbox <span style="background: #F2A93B; color: #13212E; font-size: 12px; font-weight: 700; padding: 2px 8px; border-radius: 999px">5</span></a>
<a href="08-BulkSend.dc.html" data-nav="bulk" style="display: flex; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">Bulk send</a>
<a href="09-Templates.dc.html" data-nav="templates" style="display: flex; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">Message templates</a>
<a href="10-Onboarding.dc.html" data-nav="onboarding" style="display: flex; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">Onboarding</a>
<a href="11-ChangeApprovals.dc.html" data-nav="changes" style="display: flex; align-items: center; padding: 10px 12px; min-height: 44px; box-sizing: border-box; border-radius: 8px; color: #C9D6E3; text-decoration: none">Changes and renewals</a>
</div>"""

ACTIVE = {
    "01-Main.dc.html": "today",
    "02-ClientsList.dc.html": "clients",
    "03-GroupRecord.dc.html": "clients",
    "04-Household.dc.html": "clients",
    "05-IndividualIntake.dc.html": "clients",
    "06-Import.dc.html": "clients",
    "07-Inbox.dc.html": "inbox",
    "08-BulkSend.dc.html": "bulk",
    "09-Templates.dc.html": "templates",
    "10-Onboarding.dc.html": "onboarding",
    "11-ChangeApprovals.dc.html": "changes",
    "12-Renewal.dc.html": "changes",
}

EMPLOYER_NAV = (
    '<nav aria-label="Employer" style="display: flex; flex-wrap: wrap; gap: 4px">'
    '<a class="tn" href="05-EmployerCompany.dc.html" data-nav="company">Company</a>'
    '<a class="tn" href="02-EmployerSetup.dc.html" data-nav="plans">Plans &amp; agreement</a>'
    '<a class="tn" href="03-CensusUpload.dc.html" data-nav="census">Census</a>'
    '<a class="tn" href="04-EmployerEmployees.dc.html" data-nav="employees">Employees</a>'
    "</nav>"
)

EMPLOYER_ACTIVE = {
    "02-EmployerSetup.dc.html": "plans",
    "03-CensusUpload.dc.html": "census",
    "04-EmployerEmployees.dc.html": "employees",
    "05-EmployerCompany.dc.html": "company",
}


def mark_staff(nav: str, key: str) -> str:
    pattern = rf'(<a href="[^"]+" data-nav="{key}" )style="([^"]*)"'
    def repl(m: re.Match[str]) -> str:
        style = m.group(2)
        style = style.replace("color: #C9D6E3", "background: #24486B; color: #FFFFFF; font-weight: 600")
        return f'{m.group(1)}aria-current="page" style="{style}"'
    return re.sub(pattern, repl, nav, count=1)


def mark_employer(nav: str, key: str) -> str:
    return nav.replace(
        f'data-nav="{key}"',
        f'data-nav="{key}" aria-current="page"',
        1,
    )


root = Path(__file__).resolve().parents[1]
staff = root / "1-staff"
pat = re.compile(
    r'<div style="display: flex; flex-direction: column; gap: 2px">.*?</div>\s*<div style="margin-top: auto',
    re.S,
)

for f in sorted(staff.glob("*.dc.html")):
    text = f.read_text(encoding="utf-8")
    key = ACTIVE.get(f.name)
    nav = STAFF_NAV if not key else mark_staff(STAFF_NAV, key)
    if not pat.search(text):
        print("NO NAV", f.name)
        continue
    text = pat.sub(nav + "\n<div style=\"margin-top: auto", text, count=1)
    text = text.replace("Benefits Platform", "CRM and onboarding")
    f.write_text(text, encoding="utf-8")
    print("staff", f.name)

employer = root / "2-employer-hr-onboarding"
emp_pat = re.compile(r'<nav aria-label="Employer"[^>]*>.*?</nav>', re.S)
for f in sorted(employer.glob("*.dc.html")):
    text = f.read_text(encoding="utf-8")
    if not emp_pat.search(text):
        print("no employer nav", f.name)
        continue
    key = EMPLOYER_ACTIVE.get(f.name)
    nav = EMPLOYER_NAV if not key else mark_employer(EMPLOYER_NAV, key)
    text = emp_pat.sub(nav, text, count=1)
    text = text.replace("Tom Bartram", "Tom Brooks")
    f.write_text(text, encoding="utf-8")
    print("employer", f.name)
